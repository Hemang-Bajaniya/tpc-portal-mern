import Company from "../models/Company.js";
import CompanyJobProfile from "../models/CompanyJobProfile.js";
import { apiResponse } from "../util/apiResponse.js";

const createCompany = async (req, res) => {
  try {
    const company = new Company(req.body);
    const saved = await company.save();
    return res
      .status(201)
      .json(
        new apiResponse({
          success: true,
          message: "Company created successfully",
          data: saved,
        })
      );
  } catch (error) {
    console.error("createCompany error:", error);
    const status = error.name === "ValidationError" ? 400 : 500;
    return res
      .status(status)
      .json(
        new apiResponse({
          success: false,
          message: "Failed to create company",
          data: null,
          error: error.message,
        })
      );
  }
};

const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    return res
      .status(200)
      .json(
        new apiResponse({
          data: companies,
          message: "Companies retrieved successfully",
          success: true,
        })
      );
  } catch (error) {
    console.error("getCompanies error:", error);
    return res
      .status(500)
      .json(
        new apiResponse({
          data: null,
          message: "Failed to fetch companies",
          success: false,
          error: error.message,
        })
      );
  }
};

const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Company.findById(id);
    if (!company) {
      return res
        .status(404)
        .json(
          new apiResponse({ success: false, message: "Company not found" })
        );
    }
    return res
      .status(200)
      .json(
        new apiResponse({
          success: true,
          message: "Company retrieved",
          data: company,
        })
      );
  } catch (error) {
    console.error("getCompanyById error:", error);
    if (error.name === "CastError") {
      return res
        .status(400)
        .json(
          new apiResponse({
            success: false,
            message: "Invalid company id",
            data: null,
            error: error.message,
          })
        );
    }
    return res
      .status(500)
      .json(
        new apiResponse({
          success: false,
          message: "Failed to fetch company",
          data: null,
          error: error.message,
        })
      );
  }
};

const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Company.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res
        .status(404)
        .json(
          new apiResponse({ success: false, message: "Company not found" })
        );
    }
    return res
      .status(200)
      .json(
        new apiResponse({
          success: true,
          message: "Company updated successfully",
          data: updated,
        })
      );
  } catch (error) {
    console.error("updateCompany error:", error);
    if (error.name === "CastError") {
      return res
        .status(400)
        .json(
          new apiResponse({
            success: false,
            message: "Invalid company id",
            data: null,
            error: error.message,
          })
        );
    }
    const status = error.name === "ValidationError" ? 400 : 500;
    return res
      .status(status)
      .json(
        new apiResponse({
          success: false,
          message: "Failed to update company",
          data: null,
          error: error.message,
        })
      );
  }
};

const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;

    const jobs = await CompanyJobProfile.find({ company_id: id });
    if (jobs.length > 0) {
      return res
        .status(400)
        .json(
          new apiResponse({
            success: false,
            message:
              "Cannot delete company with associated job profiles. Please delete associated job profiles first.",
          })
        );
    }

    const deleted = await Company.findByIdAndDelete(id);
    if (!deleted) {
      return res
        .status(404)
        .json(
          new apiResponse({ success: false, message: "Company not found" })
        );
    }
    return res
      .status(200)
      .json(
        new apiResponse({
          success: true,
          message: "Company deleted successfully",
          data: deleted,
        })
      );
  } catch (error) {
    console.error("deleteCompany error:", error);
    if (error.name === "CastError") {
      return res
        .status(400)
        .json(
          new apiResponse({
            success: false,
            message: "Invalid company id",
            data: null,
            error: error.message,
          })
        );
    }
    return res
      .status(500)
      .json(
        new apiResponse({
          success: false,
          message: "Failed to delete company",
          data: null,
          error: error.message,
        })
      );
  }
};

export {
  createCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
};
