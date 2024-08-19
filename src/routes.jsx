import React from "react"
import Auth from "./hoc/Auth"
import AdminAuth from "./hoc/AdminAuth"
import AdminOrSchoolOwnerAuth from "./hoc/AdminOrSchoolOwnerAuth"
import ParentAuth from "./hoc/ParentAuth"
import ResetPassword from "./components/auth/ResetPassword"
import ViewListAndSearchUserComponent from "./components/user/ViewListAndSearchUserComponent"
import CreateNewUserComponent from "./components/user/CreateNewUserComponent"
import ViewUserDetailsComponent from "./components/user/ViewUserDetailsComponent"
import EditUserAccountComponent from "./components/user/EditUserAccountComponent"
import AdminManageUser from "./pages/AdminManageUser"
import SchoolDetailsComponents from "./components/school/SchoolDetailsComponents"
import ViewAndSearchSchoolComponent from "./components/school/ViewAndSearchSchoolComponent"
import RatingAndFeedbackComponent from "./components/school/RatingAndFeedbackComponent"
import AddNewSchoolComponent from "./components/school/AddNewSchoolComponent"
import EditSchoolComponent from "./components/school/EditSchoolComponent"
import HomePage from "./pages/HomePage"
import Page403 from "./components/auth/Page403"
import Page404 from "./components/auth/Page404"
import Page500 from "./components/auth/Page500"
import ViewAndSearchRequestComponents from "./components/request/ViewAndSearchRequestComponents"
import RequestDetailsComponents from "./components/request/RequestDetailsComponents"
import ViewAndSearchParentComponent from "./components/parent/ViewAndSearchParentComponent"
import ParentDetailsComponents from "./components/parent/ParentDetailsComponents"
import ViewAndSearchRequestReminderComponents from "./components/reminder/ViewAndSearchRequestReminderComponents"
import UserSearchSchool from "./pages/UserSearchSchool"
import ViewParentProfileComponent from "./components/parent/ViewParentProfileComponent"
import LoginManager from "./components/auth/LoginManager"
import SchoolDetailPublic from "./components/school/SchoolDetailPublic"
import RatingSchoolByUser from "./components/school/RatingSchoolByUser"
import CounselingForm from "./components/common/CounselingForm"
import ViewMySchoolComponents from "./components/school/ViewMySchoolComponents"
import ViewMyRequest from "./components/parent/ViewMyRequest"
import PageLayoutPublic from "./pages/publicWebsite/PageLayoutPublic"

export const routes = [
  {
    path: "/home",
    element: <PageLayoutPublic />,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: "search-school",
        element: <UserSearchSchool />,
      },
      {
        path: "search-school/school-detail/:id",
        element: <SchoolDetailPublic />,
      },
      {
        path: "rating-school/:id",
        element: <RatingSchoolByUser />,
      },
      {
        path: "request-counseling/:id",
        element: <CounselingForm />,
      },
      {
        path: "view-my-school",
        element: <Auth><ParentAuth><ViewMySchoolComponents /></ParentAuth></Auth>,
      },
      {
        path: "view-my-profile",
        element: <Auth><ParentAuth><ViewParentProfileComponent /></ParentAuth></Auth>
      },
      { path: "requests", element: <ViewMyRequest /> },
    ],
  },
  {
    path: "/",
    element: null,
    children: [
      { path: "auth/login", element: <LoginManager show={true} /> },
      { path: "auth/reset/:token", element: <ResetPassword /> },
      { path: "auth/403", element: <Page403 /> },
      { path: "auth/404", element: <Page404 /> },
      { path: "auth/500", element: <Page500 /> },
    ],
  },

  {
    path: "/user-management",
    element: (
      <Auth>
        <AdminAuth>
          <AdminManageUser />
        </AdminAuth>
      </Auth>
    ),
    children: [
      { path: "", element: <ViewListAndSearchUserComponent /> },
      { path: "add-new-user", element: <CreateNewUserComponent /> },
      { path: "user-list", element: <ViewListAndSearchUserComponent /> },
      { path: "user-detail/:id", element: <ViewUserDetailsComponent /> },
      {
        path: "user-detail/edit-user/:id",
        element: <EditUserAccountComponent />
      }
    ]
  },
  {
    path: "/school-management",
    element: (
      <Auth>
        <AdminOrSchoolOwnerAuth>
          <AdminManageUser />
        </AdminOrSchoolOwnerAuth>
      </Auth>
    ),
    children: [
      { path: "", element: <ViewAndSearchSchoolComponent /> },
      { path: "add-new-school", element: <AddNewSchoolComponent /> },
      { path: "school-list", element: <ViewAndSearchSchoolComponent /> },
      { path: "school-detail/:id", element: <SchoolDetailsComponents /> },
      {
        path: "school-detail/edit-school/:id",
        element: <EditSchoolComponent />
      },
      {
        path: "rating-feedback/:schoolId",
        element: <RatingAndFeedbackComponent />
      }
    ]
  },
  {
    path: "/request-management",
    element: (
      <Auth>
        <AdminOrSchoolOwnerAuth>
          <AdminManageUser />
        </AdminOrSchoolOwnerAuth>
      </Auth>
    ),
    children: [
      { path: "", element: <ViewAndSearchRequestComponents /> },
      {
        path: "request-list",
        element: <ViewAndSearchRequestComponents />
      },
      {
        path: "request-list/request-detail/:id",
        element: <RequestDetailsComponents />
      }
    ]
  },
  {
    path: "/reminder",
    element: (
      <Auth>
        <AdminOrSchoolOwnerAuth>
          <AdminManageUser />
        </AdminOrSchoolOwnerAuth>
      </Auth>
    ),
    children: [
      { path: "", element: <ViewAndSearchRequestReminderComponents /> },
      {
        path: "request-reminder",
        element: <ViewAndSearchRequestReminderComponents />
      }
    ]
  },
  {
    path: "/parent-management",
    element: (
      <Auth>
        <AdminOrSchoolOwnerAuth>
          <AdminManageUser />
        </AdminOrSchoolOwnerAuth>
      </Auth>
    ),
    children: [
      { path: "", element: <ViewAndSearchParentComponent /> },
      { path: "parent-list", element: <ViewAndSearchParentComponent /> },
      {
        path: "parent-list/parent-detail/:id",
        element: <ParentDetailsComponents />
      }
    ]
  }
]
