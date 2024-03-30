"use strict";

module.exports = function (app, issues) {
  app
    .route("/api/issues/:project")

    .get(function (req, res) {
      let project = req.params.project;
      let projectIssues = issues[project] || [];
      const filters = [
        "_id",
        "issue_title",
        "issue_text",
        "created_by",
        "assigned_to",
        "status_text",
        "open",
      ];
      for (let filter of filters) {
        if (req.query[filter]) {
          projectIssues = projectIssues.filter(
            (issue) => issue[filter] === req.query[filter]
          );
        }
      }
      res.json(projectIssues);
    })

    .post(function (req, res) {
      let project = req.params.project;
      // Check for required fields
      let requiredFields = ["issue_title", "issue_text", "created_by"];
      for (let field of requiredFields) {
        if (!req.body[field]) {
          res.json({ error: "required field(s) missing" });
        }
      }
      // Create new issue
      let issue = {
        _id: new Date().getTime().toString(),
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_on: new Date(),
        updated_on: new Date(),
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to || "",
        open: true,
        status_text: req.body.status_text || "",
      };
      issues[project] = issues[project] || [];
      issues[project].push(issue);
      console.log(issue);
      res.json(issue);
    })

    .put(function (req, res) {
      let project = req.params.project;
      let issueId = req.body._id;
      if (!issueId) {
        return res.json({ error: "missing _id" });
      }
      if (Object.keys(req.body).length === 1) {
        return res.json({ error: "no update field(s) sent", _id: issueId });
      }
      let projectIssues = issues[project] || [];
      let issue = projectIssues.find((issue) => issue._id == issueId);
      if (!issue) {
        return res.json({ error: "could not update", _id: issueId });
      }
      // check if no fields are sent
      if (Object.keys(req.body).length === 1) {
        return res.json({ error: "no update field(s) sent", _id: issueId });
      }
      // check for invalid fields
      const validFields = [
        "issue_title",
        "issue_text",
        "created_by",
        "assigned_to",
        "status_text",
        "open",
      ];
      const fieldsToUpdate = Object.keys(req.body).filter((field) =>
        validFields.includes(field)
      );
      if (fieldsToUpdate.length === 0) {
        return res.json({ error: "could not update", _id: issueId });
      } else {
        fieldsToUpdate.forEach((field) => {
          issue[field] = req.body[field];
        });
        issue.updated_on = new Date();
        res.json({ result: "successfully updated", _id: issueId });
      }
    })

    .delete(function (req, res) {
      let project = req.params.project;
      let issueId = req.body._id;
      if (!issueId) {
        res.json({ error: "missing _id" });
      }
      let projectIssues = issues[project] || [];
      let issue = projectIssues.find((issue) => issue._id == issueId);

      if (!issue) {
        res.json({ error: "could not delete", _id: issueId });
      } else {
        issues[project] = projectIssues.filter((issue) => issue._id != issueId);

        res.json({ result: "successfully deleted", _id: issueId });
      }
    });
};
