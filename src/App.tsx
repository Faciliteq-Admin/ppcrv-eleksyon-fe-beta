import './App.css';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import LoginPage from './pages/login';
import PageNotFound from './pages/pageNotFound';
import HomePage from './pages/home';
import BarangayListPage from './pages/sidebar_pages/location_management/barangays/barangayList';
import BarangayFormPage from './pages/sidebar_pages/location_management/barangays/barangayForm';
import MunicipalityListPage from './pages/sidebar_pages/location_management/municipalities/municipalityList';
import MunicipalityFormPage from './pages/sidebar_pages/location_management/municipalities/municipalityForm';
import ProvinceListPage, { loader as provListLoader } from './pages/sidebar_pages/location_management/provinces/provinceList';
import ProvinceFormPage from './pages/sidebar_pages/location_management/provinces/provinceForm';
import UserListPage from './pages/sidebar_pages/user_management/users/userList';
import UserFormPage from './pages/sidebar_pages/user_management/users/userForm';
import ForgotPasswordPage from './pages/forgotPassword';
import UserAccountListPage from './pages/sidebar_pages/user_accounts/userAccountList';
import UserAccountFormPage from './pages/sidebar_pages/user_accounts/userAccountForm';
import SettingsPage from './pages/sidebar_pages/settings/SettingsPage';
import { ProjectSetupProvider } from './contexts/ProjectSetupContext';
import SideNavLayout from './components/SideNavLayout';
import AdministratorListPage from './pages/sidebar_pages/user_management/administrators/AdministratorListPage';
import AdministratorFormPage from './pages/sidebar_pages/user_management/administrators/AdministratorFormPage';
import AdministratorFormEditPage from './pages/sidebar_pages/user_management/administrators/AdministratorFormEditPage';
import PrecintListPage from './pages/sidebar_pages/precints/PrecintListPage';
import CandidateListPage from './pages/sidebar_pages/candidates/CandidateListPage';
import LocalElectionListPage from './pages/sidebar_pages/local/LocalElectionListPage';
import NationalElectionListPage from './pages/sidebar_pages/national/NationalElectionListPage';
import ResultListPage from './pages/sidebar_pages/results/ResultListPage';
import UploadResultListPage from './pages/sidebar_pages/results/UploadResultListPage';
import ElectionReturnsListPage from './pages/sidebar_pages/results/ElectionReturnsListPage';
import ResultCandidatePage from './pages/sidebar_pages/results/ResultCandidatePage';

const routes = createBrowserRouter([
    {
        path: "",
        element: <SideNavLayout> <HomePage /> </SideNavLayout>,
        errorElement: <PageNotFound />,
    },
    {
        path: "home",
        element: <SideNavLayout> <HomePage /> </SideNavLayout>,
        errorElement: <PageNotFound />,
    },
    {
        path: "precints",
        element: <SideNavLayout> <PrecintListPage /> </SideNavLayout>,
        errorElement: <PageNotFound />,
    },
    {
        path: "candidates",
        element: <SideNavLayout> <CandidateListPage /> </SideNavLayout>,
        errorElement: <PageNotFound />,
    },
    {
        path: "local",
        element: <SideNavLayout> <LocalElectionListPage /> </SideNavLayout>,
        errorElement: <PageNotFound />,
    },
    {
        path: "national",
        element: <SideNavLayout> <NationalElectionListPage /> </SideNavLayout>,
        errorElement: <PageNotFound />,
    },
    {
        path: "results",
        children: [
            // {
            //     path: "/results/",
            //     element: <SideNavLayout> <ResultListPage /> </SideNavLayout>,
            //     errorElement: <PageNotFound />,
            // },
            {
                path: "/results/candidates",
                element: <SideNavLayout> <ResultListPage /> </SideNavLayout>,
                errorElement: <PageNotFound />,
            },
            {
                path: "/results/candidates/:id",
                element: <SideNavLayout> <ResultCandidatePage /> </SideNavLayout>,
                errorElement: <PageNotFound />,
            },
            {
                path: "/results/precincts",
                element: <SideNavLayout> <ResultListPage /> </SideNavLayout>,
                errorElement: <PageNotFound />,
            },
            {
                path: "/results/precincts/:id",
                element: <SideNavLayout> <ResultListPage /> </SideNavLayout>,
                errorElement: <PageNotFound />,
            },
        ],
    },
    {
        path: "results",
        element: <SideNavLayout> <ResultListPage /> </SideNavLayout>,
        errorElement: <PageNotFound />,
    },
    {
        path: "election-returns",
        element: <SideNavLayout> <ElectionReturnsListPage /> </SideNavLayout>,
        errorElement: <PageNotFound />,
    },
    {
        path: "upload-results",
        element: <SideNavLayout> <UploadResultListPage /> </SideNavLayout>,
        errorElement: <PageNotFound />,
    },
    {
        path: "login",
        element: <LoginPage />,
        errorElement: <PageNotFound />
    },
    {
        path: "settings",
        element: <SideNavLayout> <SettingsPage /> </SideNavLayout>,
        errorElement: <PageNotFound />,
    },
    {
        path: "forgot-password",
        element: <ForgotPasswordPage />,
        errorElement: <PageNotFound />
    },
    {
        path: "user-management",
        children: [
            {
                path: "/user-management/administrators",
                element: <SideNavLayout> <AdministratorListPage /> </SideNavLayout>,
                errorElement: <PageNotFound />,
            },
            {
                path: "/user-management/administrators/new",
                element: <SideNavLayout> <AdministratorFormPage /> </SideNavLayout>,
                errorElement: <PageNotFound />,
            },
            {
                path: "/user-management/administrators/:id",
                element: <SideNavLayout> <AdministratorFormEditPage /> </SideNavLayout>,
                errorElement: <PageNotFound />,
            },
        ],
    },
    {
        path: "/users",
        element: <SideNavLayout> <UserListPage /> </SideNavLayout>,
        errorElement: <PageNotFound />,
    },
    {
        path: "/users/new",
        element: <SideNavLayout> <UserFormPage /> </SideNavLayout>,
        errorElement: <PageNotFound />,
    },
    {
        path: "/users/:id",
        element: <SideNavLayout> <UserFormPage /> </SideNavLayout>,
        errorElement: <PageNotFound />,
    },
    {
        path: "/page-not-found",
        element: <PageNotFound />,
    },
    {
        path: "*",
        element: <Navigate to="/page-not-found" />,
    },

    //----- Developer Hub Routes -----\\
    {
        path: "user-accounts",
        element: <SideNavLayout> <UserAccountListPage /> </SideNavLayout>,
        errorElement: <PageNotFound />,
    },
    {
        path: "user-accounts/:id",
        element: <SideNavLayout> <UserAccountFormPage /> </SideNavLayout>,
        errorElement: <PageNotFound />,
    },
]);

function App() {

    // localStorage - use for long term use.
    // sessionStorage - use when you need to store something that changes or something

    return (
        <RouterProvider router={routes} />
    );
}

export default App;