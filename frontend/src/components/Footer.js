import React from "react";

export default function Footer() {
  return (
    <div className="footer">
      <footer className="border-top pt-3">
        <div className="text-center text-secondary footer">
          <div>
            <h2>
              Nekoula<span className="text-info">Blog</span>
            </h2>
          </div>
          <div>
            <a
              className="mr-3 text-info"
              href="https://github.com/nekoulahaddad"
            >
              <i className="fa fa-github" aria-hidden="true"></i>{" "}
            </a>
            <a className="mr-3 text-info" href="https://vk.com/n.khaddad">
              <i className="fa fa-vk" aria-hidden="true"></i>{" "}
            </a>
            <a className="text-info" href="https://www.facebook.com/nico12321">
              <i className="fa fa-facebook-f" aria-hidden="true"></i>{" "}
            </a>
          </div>
          <p>&copy; Copyright 2021, Nekoula Haddad. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
