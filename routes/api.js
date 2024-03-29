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
          res.send("missing inputs");
        }
      }
      // Create new issue
      let issue = {
        _id: new Date().getTime(),
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_on: new Date(),
        updated_on: new Date(),
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to,
        open: true,
        status_text: req.body.status_text,
      };
      issues[project] = issues[project] || [];
      issues[project].push(issue);
      res.json(issue);
    })

    .put(function (req, res) {
      let project = req.params.project;
      let issueId = req.body._id;
      if (!issueId) {
        res.send("missing _id");
      }
      let projectIssues = issues[project] || [];
      let issue = projectIssues.find((issue) => issue._id == issueId);
      if (!issue) {
        res.send("invalid _id");
      } else {
        let updates = Object.keys(req.body).filter((key) => key !== "_id");
        if (updates.length === 0) {
          return res.send("no updated field sent");
        }
        for (let update of updates) {
          issue[update] = req.body[update];
        }
        issue.updated_on = new Date();
        res.send("successfully updated");
      }
    })

    .delete(function (req, res) {
      let project = req.params.project;
      let issueId = req.body._id;
      if (!issueId) {
        res.send("missing _id");
      }
      let projectIssues = issues[project] || [];
      let issue = projectIssues.find((issue) => issue._id == issueId);
      if (!issue) {
        res.send("invalid _id");
      } else {
        issues[project] = projectIssues.filter((issue) => issue._id != issueId);
        res.send("deleted " + issueId);
      }
    });
};
