import React from "react";
import PropTypes from "prop-types";
import { Theme } from "../../theme";
import { SVG } from "../../components";

// The API returns resources with one of three types of resourceAccess.type keys. This
// let's us create the corresponding title client-side.
const resourceAccessTitles = {
  open: "This resource is free",
  register: "This resource requires registration",
  cost: "This resource requires payment",
};

const ResourceAccess = ({ type, notes }) => (
  <article aria-label='Resource Access Information'>
    <Theme element='div' className='resource__access'>
      <SVG iconType={type} />
      <h4>{resourceAccessTitles[type]}</h4>
      {notes ? <p>{notes}</p> : null}
    </Theme>
  </article>
);

ResourceAccess.propTypes = {
  type: PropTypes.string,
  notes: PropTypes.string,
};

export default ResourceAccess;
