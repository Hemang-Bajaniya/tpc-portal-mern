import CompanyJobProfile from "../models/CompanyJobProfile.js";
import Company from "../models/Company.js";
import { apiResponse } from "../util/apiResponse.js";

const createJob = async (req, res) => {
  try {
    const { company_id } = req.body;

    // If company_id provided, verify company exists
    if (company_id !== undefined && company_id !== null) {
      try {
        const company = await Company.findById(company_id);
        if (!company) {
          return res
            .status(404)
            .json(
              apiResponse({
                success: false,
                message: "Company not found for provided company_id",
                data: null,
                status: 404,
              })
            );
        }
      } catch (err) {
        // CastError or other DB error while looking up company id
        console.error("createJob company lookup error:", err);
        if (err.name === "CastError") {
          return res
            .status(400)
            .json(
              apiResponse({
                success: false,
                message: "Invalid company id provided",
                data: null,
                error: err.message,
                status: 400,
              })
            );
        }
        return res
          .status(500)
          .json(
            apiResponse({
              success: false,
              message: "Failed to verify company",
              data: null,
              error: err.message,
              status: 500,
            })
          );
      }
    }

    const job = new CompanyJobProfile(req.body);
    const saved = await job.save();
    return res
      .status(201)
      .json(
        apiResponse({
          success: true,
          message: "Job created successfully",
          data: saved,
          status: 201,
        })
      );
  } catch (error) {
    console.error("createJob error:", error);
    const status = error.name === "ValidationError" ? 400 : 500;
    return res
      .status(status)
      .json(
        apiResponse({
          success: false,
          message: "Failed to create job",
          data: null,
          error: error.message,
          status,
        })
      );
  }
};

const getJobs = async (req, res) => {
  try {
    // optional filters via query params: company_id, title, for_dept
    const filter = {};
    if (req.query.company_id) filter.company_id = req.query.company_id;
    if (req.query.title)
      filter.title = { $regex: req.query.title, $options: "i" };
    if (req.query.for_dept) filter.for_dept = req.query.for_dept;

    const jobs = await CompanyJobProfile.find(filter).populate(["company_id"]);
    return res
      .status(200)
      .json(
        apiResponse({
          success: true,
          message: "Jobs retrieved successfully",
          data: jobs,
          status: 200,
        })
      );
  } catch (error) {
    console.error("getJobs error:", error);
    return res
      .status(500)
      .json(
        apiResponse({
          success: false,
          message: "Failed to fetch jobs",
          data: null,
          error: error.message,
          status: 500,
        })
      );
  }
};

export const getActiveJobs = async (req, res) => {
  try {
    // Optional filters (same as getJobs)
    const filter = { status: "Active" }; // always fetch only active jobs

    if (req.query.company_id) filter.company_id = req.query.company_id;
    if (req.query.title)
      filter.title = { $regex: req.query.title, $options: "i" };
    if (req.query.for_dept) filter.for_dept = req.query.for_dept;

    // Fetch jobs with company details populated
    const jobs = await CompanyJobProfile.find(filter).populate(["company_id"]);

    return res.status(200).json(
      apiResponse({
        success: true,
        message: "Active jobs retrieved successfully",
        data: jobs,
        status: 200,
      })
    );
  } catch (error) {
    console.error("getActiveJobs error:", error);
    return res.status(500).json(
      apiResponse({
        success: false,
        message: "Failed to fetch active jobs",
        data: null,
        error: error.message,
        status: 500,
      })
    );
  }
};

const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await CompanyJobProfile.findById(id).populate(["company_id"]);
    if (!job) {
      return res
        .status(404)
        .json(
          apiResponse({
            success: false,
            message: "Job not found",
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
          message: "Job retrieved",
          data: job,
          status: 200,
        })
      );
  } catch (error) {
    console.error("getJobById error:", error);
    if (error.name === "CastError") {
      return res
        .status(400)
        .json(
          apiResponse({
            success: false,
            message: "Invalid job id",
            data: null,
            error: error.message,
            status: 400,
          })
        );
    }
    return res
      .status(500)
      .json(
        apiResponse({
          success: false,
          message: "Failed to fetch job",
          data: null,
          error: error.message,
          status: 500,
        })
      );
  }
};

const updateJob = async (req, res) => {
  try {
    const { id } = req.params;

    // If company_id is being updated, verify company exists
    if (req.body.company_id !== undefined && req.body.company_id !== null) {
      try {
        const company = await Company.findById(req.body.company_id);
        if (!company) {
          return res
            .status(404)
            .json(
              apiResponse({
                success: false,
                message: "Company not found for provided company_id",
                data: null,
                status: 404,
              })
            );
        }
      } catch (err) {
        console.error("updateJob company lookup error:", err);
        if (err.name === "CastError") {
          return res
            .status(400)
            .json(
              apiResponse({
                success: false,
                message: "Invalid company id provided",
                data: null,
                error: err.message,
                status: 400,
              })
            );
        }
        return res
          .status(500)
          .json(
            apiResponse({
              success: false,
              message: "Failed to verify company",
              data: null,
              error: err.message,
              status: 500,
            })
          );
      }
    }

    const updated = await CompanyJobProfile.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res
        .status(404)
        .json(
          apiResponse({
            success: false,
            message: "Job not found",
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
          message: "Job updated successfully",
          data: updated,
          status: 200,
        })
      );
  } catch (error) {
    console.error("updateJob error:", error);
    if (error.name === "CastError") {
      return res
        .status(400)
        .json(
          apiResponse({
            success: false,
            message: "Invalid job id",
            data: null,
            error: error.message,
            status: 400,
          })
        );
    }
    const status = error.name === "ValidationError" ? 400 : 500;
    return res
      .status(status)
      .json(
        apiResponse({
          success: false,
          message: "Failed to update job",
          data: null,
          error: error.message,
          status,
        })
      );
  }
};

const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await CompanyJobProfile.findByIdAndDelete(id);
    if (!deleted) {
      return res
        .status(404)
        .json(
          apiResponse({
            success: false,
            message: "Job not found",
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
          message: "Job deleted successfully",
          data: deleted,
          status: 200,
        })
      );
  } catch (error) {
    console.error("deleteJob error:", error);
    if (error.name === "CastError") {
      return res
        .status(400)
        .json(
          apiResponse({
            success: false,
            message: "Invalid job id",
            data: null,
            error: error.message,
            status: 400,
          })
        );
    }
    return res
      .status(500)
      .json(
        apiResponse({
          success: false,
          message: "Failed to delete job",
          data: null,
          error: error.message,
          status: 500,
        })
      );
  }
};

export { createJob, getJobs, getJobById, updateJob, deleteJob };