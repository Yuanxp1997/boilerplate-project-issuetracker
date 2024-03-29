const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  //Create an issue with every field: POST request to /api/issues/{project}
  test("Create an issue with every field", function (done) {
    chai
      .request(server)
      .post("/api/issues/test")
      .send({
        issue_title: "Title",
        issue_text: "text",
        created_by: "Functional Test - Every field filled in",
        assigned_to: "Chai and Mocha",
        status_text: "In QA",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.issue_title, "Title");
        assert.equal(res.body.issue_text, "text");
        assert.equal(
          res.body.created_by,
          "Functional Test - Every field filled in"
        );
        assert.equal(res.body.assigned_to, "Chai and Mocha");
        assert.equal(res.body.status_text, "In QA");
        done();
      });
  });

  //Create an issue with only required fields: POST request to /api/issues/{project}
  test("Create an issue with only required fields", function (done) {
    chai
      .request(server)
      .post("/api/issues/test")
      .send({
        issue_title: "Title",
        issue_text: "text",
        created_by: "Functional Test - Only required fields",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.issue_title, "Title");
        assert.equal(res.body.issue_text, "text");
        assert.equal(
          res.body.created_by,
          "Functional Test - Only required fields"
        );
        done();
      });
  });

  //Create an issue with missing required fields: POST request to /api/issues/{project}
  test("Create an issue with missing required fields", function (done) {
    chai
      .request(server)
      .post("/api/issues/test")
      .send({
        issue_text: "text",
        created_by: "Functional Test - Missing required fields",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.text, "missing inputs");
        done();
      });
  });

  //View issues on a project: GET request to /api/issues/{project}
  test("View issues on a project", function (done) {
    chai
      .request(server)
      .get("/api/issues/test")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        done();
      });
  });

  //View issues on a project with one filter: GET request to /api/issues/{project}
  test("View issues on a project with one filter", function (done) {
    chai
      .request(server)
      .get("/api/issues/test?open=true")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        done();
      });
  });

  //View issues on a project with multiple filters: GET request to /api/issues/{project}
  test("View issues on a project with multiple filters", function (done) {
    chai
      .request(server)
      .get("/api/issues/test?open=true&issue_title=Title")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        done();
      });
  });

  //Update one field on an issue: PUT request to /api/issues/{project}
  test("Update one field on an issue", function (done) {
    chai
      .request(server)
      .put("/api/issues/test")
      .send({ _id: "1", issue_title: "Updated Title" })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.text, "successfully updated");
        done();
      });
  });

  //Update multiple fields on an issue: PUT request to /api/issues/{project}
  test("Update multiple fields on an issue", function (done) {
    chai
      .request(server)
      .put("/api/issues/test")
      .send({
        _id: "1",
        issue_title: "Updated Title",
        issue_text: "Updated Text",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.text, "successfully updated");
        done();
      });
  });

  //Update an issue with missing _id: PUT request to /api/issues/{project}
  test("Update an issue with missing _id", function (done) {
    chai
      .request(server)
      .put("/api/issues/test")
      .send({ issue_title: "Updated Title" })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.text, "missing _id");
        done();
      });
  });

  //Update an issue with no fields to update: PUT request to /api/issues/{project}
  test("Update an issue with no fields to update", function (done) {
    chai
      .request(server)
      .put("/api/issues/test")
      .send({ _id: "1" })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.text, "no updated field sent");
        done();
      });
  });

  //Update an issue with an invalid _id: PUT request to /api/issues/{project}
  test("Update an issue with an invalid _id", function (done) {
    chai
      .request(server)
      .put("/api/issues/test")
      .send({ _id: "invalid_id", issue_title: "Updated Title" })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.text, "invalid _id");
        done();
      });
  });

  //Delete an issue: DELETE request to /api/issues/{project}
  test("Delete an issue", function (done) {
    chai
      .request(server)
      .delete("/api/issues/test")
      .send({ _id: "1" })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.text, "deleted 1");
        done();
      });
  });

  //Delete an issue with an invalid _id: DELETE request to /api/issues/{project}
  test("Delete an issue with an invalid _id", function (done) {
    chai
      .request(server)
      .delete("/api/issues/test")
      .send({ _id: "invalid_id" })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.text, "invalid _id");
        done();
      });
  });

  //Delete an issue with missing _id: DELETE request to /api/issues/{project}
  test("Delete an issue with missing _id", function (done) {
    chai
      .request(server)
      .delete("/api/issues/test")
      .send({})
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.text, "missing _id");
        done();
      });
  });
});
