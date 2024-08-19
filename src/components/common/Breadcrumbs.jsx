import React from "react"
import { Link, useLocation, useParams } from "react-router-dom"
import "../../assets/scss/3-components/_breadcrumbs.scss"

export default function Breadcrumbs() {
    const location = useLocation()
    const { id } = useParams()

    let adjustedPathname = location.pathname

  if (location.pathname === "/user-management") {
    adjustedPathname = "/user-management/user-list";
  }
  if (location.pathname === "/school-management") {
    adjustedPathname = "/school-management/school-list";
  }
  if (location.pathname === "/request-management") {
    adjustedPathname = "/request-management/request-list";
  }
  if (location.pathname === "/search-school") {
    adjustedPathname = "/search-school";
  }
  let currentLink = "";

  const crumbMapping = {
    "user-management": "User Management",
    "add-new-user": "Add new user",
    "user-list": "User List",
    "user-detail": "User details",
    "edit-user": "Edit User",
    "school-management": "School Management",
    "school-list": "School List",
    "school-detail": "School details",
    "add-new-school": "Add new school",
    "edit-school": "Edit School",
    "request-management": "Request Management",
    "request-list": "Request List",
    "request-detail": "Request Detail",
    reminder: "Reminder",
    "request-reminder": "Request Reminder",
    "parent-management": "Parent Management",
    "parent-list": "Parent List",
    "rating-feedback": "Rating Feedback",
    "parent-detail": "View parent's details",
    home: "Home",
    requests: "My requests",
    "search-school": "Search for school",
    "view-my-school": "View My School",
    "view-my-profile": "My profile"
  };

  const formatCrumb = (crumb) => {
    return crumbMapping[crumb] || crumb;
  };

  const noIdCrumbs = [
    "search-school",
    "user-management",
    "add-new-user",
    "user-list",
    "school-management",
    "request-management",
    "request-list",
    "parent-list",
    "parent-management",
    "home"
  ];
  if (adjustedPathname === "/search-school") {
    currentLink =
      "/search-school?searchKey=&selectedCityId=defaultCity&selectedDistrictId=defaultDistrict";
    crumbs.push(
      <div className="crumb" key={currentLink}>
        <Link to={currentLink}>{formatCrumb("search-school")}</Link>
      </div>
    );
  }

    const crumbs = adjustedPathname
        .split("/")
        .filter((crumb) => crumb !== "" && !/^\d+$/.test(crumb))
        .map((crumb) => {
            currentLink += `/${crumb}`
            return (
                <div className="crumb" key={currentLink}>
                    {id !== undefined && !noIdCrumbs.includes(crumb) ? (
                        <Link to={currentLink + "/" + id}>{formatCrumb(crumb)}</Link>
                    ) : (
                        <Link to={currentLink}>{formatCrumb(crumb)}</Link>
                    )}
                </div>
            )
        })

    return <div className="breadcrumbs">{crumbs}</div>
}
