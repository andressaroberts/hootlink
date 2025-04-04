import React from "react";
import { Link } from "react-router-dom";

const Footer = ({ pageContext }) => {
  return (
    <footer className="border-t border-border py-4 bg-white">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-center text-sm text-muted-foreground md:text-left">
          &copy; {new Date().getFullYear()} Hootlink. No rights reserved. Just
          hooting around.
        </p>
        {(pageContext === "landing" || pageContext === "signup") && (
          <div className="flex gap-4">
            <Link
              to="/terms"
              className="text-sm text-muted-foreground hover:underline"
            >
              Terms
            </Link>
            <Link
              to="/privacy"
              className="text-sm text-muted-foreground hover:underline"
            >
              Privacy
            </Link>
            <Link
              to="/about"
              className="text-sm text-muted-foreground hover:underline"
            >
              About
            </Link>
          </div>
        )}
        {pageContext === "login" && (
          <div className="flex gap-4">
            <Link
              to="/"
              className="text-sm text-muted-foreground hover:underline"
            >
              Home
            </Link>
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;
