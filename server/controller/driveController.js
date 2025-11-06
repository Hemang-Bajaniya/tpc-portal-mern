import mongoose from "mongoose";
import PlacementDrive from "../models/Drive.js";
import Company from "../models/Company.js";
import CompanyJobProfile from "../models/CompanyJobProfile.js";
import { apiResponse } from "../util/apiResponse.js";

const isValidId = (id) => mongoose.Types.ObjectId.isValid(String(id));

const computeStatus = (drive_date, last_date_to_apply) => {
  const now = new Date();
  if (!drive_date) return "Upcoming";
  const d = new Date(drive_date);
  const last = last_date_to_apply ? new Date(last_date_to_apply) : null;
  if (d > now) return "Upcoming";
  if (d <= now && (!last || last >= now)) return "Ongoing";
  return "Completed";
};

const createDrive = async (req, res) => {
  try {
    const {
      job_profile,
      drive_title,
      drive_date,
      last_date_to_apply,
      description,
      hiring_process,
    } = req.body;

    const job = job_profile
      ? await CompanyJobProfile.findById(job_profile)
      : null;

    const company = job ? job.company_id : req.body.company;

    if (!company || !isValidId(company)) {
      return res
        .status(400)
        .json(
          apiResponse({
            success: false,
            message: "Valid company id is required",
            data: null,
            status: 400,
          })
        );
    }

    const status = computeStatus(drive_date, last_date_to_apply);

    const drive = new PlacementDrive({
      company,
      job_profile,
      drive_title,
      description,
      hiring_process,
      drive_date,
      last_date_to_apply,
      status,
    });

    const saved = await drive.save();
    // const populated = await saved.populate(['company']);

    return res
      .status(201)
      .json(
        apiResponse({
          success: true,
          message: "Placement drive created",
          data: saved,
          status: 201,
        })
      );
  } catch (error) {
    console.error("createDrive error:", error);
    const status = error.name === "ValidationError" ? 400 : 500;
    return res
      .status(status)
      .json(
        apiResponse({
          success: false,
          message: "Failed to create drive",
          data: null,
          error: error.message,
          status,
        })
      );
  }
};

const getDrives = async (req, res) => {
  try {
    const filter = {};
    if (req.query.company && isValidId(req.query.company))
      filter.company = req.query.company;
    if (req.query.status) filter.status = req.query.status;
    // pagination optional
    const page = Math.max(1, parseInt(req.query.page || "1", 10));
    const limit = Math.max(1, parseInt(req.query.limit || "20", 10));
    const skip = (page - 1) * limit;

    const drives = await PlacementDrive.find(filter)
      .sort({ drive_date: -1 })
      .skip(skip)
      .limit(limit)
      .populate(["company", "job_profiles"]);
    const total = await PlacementDrive.countDocuments(filter);

    return res
      .status(200)
      .json(
        apiResponse({
          success: true,
          message: "Placement drives retrieved",
          data: { items: drives, total, page, limit },
          status: 200,
        })
      );
  } catch (error) {
    console.error("getDrives error:", error);
    return res
      .status(500)
      .json(
        apiResponse({
          success: false,
          message: "Failed to fetch drives",
          data: null,
          error: error.message,
          status: 500,
        })
      );
  }
};

const getDriveById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res
        .status(400)
        .json(
          apiResponse({
            success: false,
            message: "Invalid drive id",
            data: null,
            status: 400,
          })
        );
    }
    const drive = await PlacementDrive.findById(id).populate([
      "company",
      "job_profiles",
    ]);
    if (!drive) {
      return res
        .status(404)
        .json(
          apiResponse({
            success: false,
            message: "Drive not found",
            data: null,
            status: 404,
          })
        );
    }
    return res
      .status(200)
      .json(
        apiResponse({
          success: true,
          message: "Drive retrieved",
          data: drive,
          status: 200,
        })
      );
  } catch (error) {
    console.error("getDriveById error:", error);
    return res
      .status(500)
      .json(
        apiResponse({
          success: false,
          message: "Failed to fetch drive",
          data: null,
          error: error.message,
          status: 500,
        })
      );
  }
};

const updateDrive = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!isValidId(id)) {
      return res
        .status(400)
        .json(
          apiResponse({
            success: false,
            message: "Invalid drive id",
            data: null,
            status: 400,
          })
        );
    }

    // if company updated, validate it
    if (updates.company !== undefined && updates.company !== null) {
      if (!isValidId(updates.company)) {
        return res
          .status(400)
          .json(
            apiResponse({
              success: false,
              message: "Invalid company id",
              data: null,
              status: 400,
            })
          );
      }
      const foundCompany = await Company.findById(updates.company);
      if (!foundCompany) {
        return res
          .status(404)
          .json(
            apiResponse({
              success: false,
              message: "Company not found",
              data: null,
              status: 404,
            })
          );
      }
    }

    // if job_profiles updated, validate them and ownership (if company present)
    if (updates.job_profiles !== undefined) {
      if (!Array.isArray(updates.job_profiles)) {
        return res
          .status(400)
          .json(
            apiResponse({
              success: false,
              message: "job_profiles must be an array",
              data: null,
              status: 400,
            })
          );
      }
      const invalidIds = updates.job_profiles.filter((id) => !isValidId(id));
      if (invalidIds.length) {
        return res
          .status(400)
          .json(
            apiResponse({
              success: false,
              message: "One or more job ids are invalid",
              data: invalidIds,
              status: 400,
            })
          );
      }
      const jobs = await CompanyJobProfile.find({
        _id: { $in: updates.job_profiles },
      });
      if (jobs.length !== updates.job_profiles.length) {
        const foundIds = jobs.map((j) => String(j._id));
        const missing = updates.job_profiles.filter(
          (i) => !foundIds.includes(String(i))
        );
        return res
          .status(404)
          .json(
            apiResponse({
              success: false,
              message: "Some job profiles not found",
              data: missing,
              status: 404,
            })
          );
      }
      // if company provided or existing drive has company, ensure ownership
      const driveExisting = await PlacementDrive.findById(id);
      const companyToCheck =
        updates.company ??
        (driveExisting ? String(driveExisting.company) : null);
      if (companyToCheck) {
        const notBelonging = jobs.filter(
          (j) => String(j.company_id) !== String(companyToCheck)
        );
        if (notBelonging.length) {
          return res
            .status(400)
            .json(
              apiResponse({
                success: false,
                message:
                  "One or more job_profiles do not belong to the drive company",
                data: notBelonging.map((j) => j._id),
                status: 400,
              })
            );
        }
      }
    }

    if (updates.drive_date || updates.last_date_to_apply) {
      updates.status = computeStatus(
        updates.drive_date ?? undefined,
        updates.last_date_to_apply ?? undefined
      );
    }

    const updated = await PlacementDrive.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).populate(["company", "job_profiles"]);
    if (!updated) {
      return res
        .status(404)
        .json(
          apiResponse({
            success: false,
            message: "Drive not found",
            data: null,
            status: 404,
          })
        );
    }

    return res
      .status(200)
      .json(
        apiResponse({
          success: true,
          message: "Drive updated",
          data: updated,
          status: 200,
        })
      );
  } catch (error) {
    console.error("updateDrive error:", error);
    const status = error.name === "ValidationError" ? 400 : 500;
    return res
      .status(status)
      .json(
        apiResponse({
          success: false,
          message: "Failed to update drive",
          data: null,
          error: error.message,
          status,
        })
      );
  }
};

const deleteDrive = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res
        .status(400)
        .json(
          apiResponse({
            success: false,
            message: "Invalid drive id",
            data: null,
            status: 400,
          })
        );
    }
    const deleted = await PlacementDrive.findByIdAndDelete(id).populate([
      "company",
      "job_profiles",
    ]);
    if (!deleted) {
      return res
        .status(404)
        .json(
          apiResponse({
            success: false,
            message: "Drive not found",
            data: null,
            status: 404,
          })
        );
    }
    return res
      .status(200)
      .json(
        apiResponse({
          success: true,
          message: "Drive deleted",
          data: deleted,
          status: 200,
        })
      );
  } catch (error) {
    console.error("deleteDrive error:", error);
    return res
      .status(500)
      .json(
        apiResponse({
          success: false,
          message: "Failed to delete drive",
          data: null,
          error: error.message,
          status: 500,
        })
      );
  }
};

/*
  Create drives grouped by company for provided job ids.
  Request body:
  {
    "job_ids": ["<jobId1>", "<jobId2>", ...],
    "drive_title": "Campus Drive - Nov 2025",
    "drive_date": "2025-11-10T09:00:00.000Z",
    "last_date_to_apply": "2025-11-01T23:59:59.000Z",
    "description": "...",
    "hiring_process": [...]
  }
  Response: array of created drives (populated)
*/
const createDrivesFromJobs = async (req, res) => {
  try {
    const {
      job_ids = [],
      drive_title,
      drive_date,
      last_date_to_apply,
      description,
      hiring_process,
    } = req.body;
    if (!Array.isArray(job_ids) || job_ids.length === 0) {
      return res
        .status(400)
        .json(
          apiResponse({
            success: false,
            message: "job_ids array is required",
            data: null,
            status: 400,
          })
        );
    }
    const invalid = job_ids.filter((id) => !isValidId(id));
    if (invalid.length) {
      return res
        .status(400)
        .json(
          apiResponse({
            success: false,
            message: "One or more job ids are invalid",
            data: invalid,
            status: 400,
          })
        );
    }

    const jobs = await CompanyJobProfile.find({ _id: { $in: job_ids } });
    if (jobs.length !== job_ids.length) {
      const foundIds = jobs.map((j) => String(j._id));
      const missing = job_ids.filter((id) => !foundIds.includes(String(id)));
      return res
        .status(404)
        .json(
          apiResponse({
            success: false,
            message: "Some jobs not found",
            data: missing,
            status: 404,
          })
        );
    }

    // group by company
    const groups = jobs.reduce((acc, j) => {
      const key = String(j.company_id);
      acc[key] = acc[key] || { company: key, job_profiles: [] };
      acc[key].job_profiles.push(String(j._id));
      return acc;
    }, {});

    const created = [];
    for (const key of Object.keys(groups)) {
      const grp = groups[key];
      const companyExists = await Company.findById(grp.company);
      if (!companyExists) {
        // skip creating drive for missing company
        continue;
      }
      const drive = new PlacementDrive({
        company: grp.company,
        job_profiles: grp.job_profiles,
        drive_title: drive_title
          ? `${drive_title} - ${companyExists.name || ""}`
          : `Drive - ${companyExists.name || ""}`,
        description,
        hiring_process,
        drive_date,
        last_date_to_apply,
        status: computeStatus(drive_date, last_date_to_apply),
      });
      const saved = await drive.save();
      const populated = await PlacementDrive.findById(saved._id).populate([
        "company",
        "job_profiles",
      ]);
      created.push(populated);
    }

    return res
      .status(201)
      .json(
        apiResponse({
          success: true,
          message: "Drives created from jobs",
          data: created,
          status: 201,
        })
      );
  } catch (error) {
    console.error("createDrivesFromJobs error:", error);
    return res
      .status(500)
      .json(
        apiResponse({
          success: false,
          message: "Failed to create drives from jobs",
          data: null,
          error: error.message,
          status: 500,
        })
      );
  }
};

export {
  createDrive,
  getDrives,
  getDriveById,
  updateDrive,
  deleteDrive,
  createDrivesFromJobs,
};
