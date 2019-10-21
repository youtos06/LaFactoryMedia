import React from "react";
import { Link } from "react-router-dom";

export default function listMinProjectClient(projects) {
  if (projects && projects.length > 0) {
    return (
      <div style={{ margin: 20 }}>
        <h2>liste des projets en collaboration</h2>
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Nom</th>
              <th scope="col">Date</th>
              <th scope="col">Link</th>
            </tr>
          </thead>
          {projects.map(p => (
            <tbody key={p._id}>
              <tr>
                <td>{p.title}</td>
                <td>{p.created_at.slice(0, 10)}</td>
                <td>
                  <Link to={`/projects/${projects._id}`}>visit</Link>
                </td>
              </tr>
            </tbody>
          ))}
        </table>
      </div>
    );
  }
  return <div></div>;
}
//this function is to show the projects of a certain client in a table by showing only their name and date with link to them
