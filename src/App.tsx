import './App.css';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import LoginPage from './pages/login';
import PageNotFound from './pages/pageNotFound';
import ForgotPasswordPage from './pages/forgotPassword';
import SettingsPage from './pages/sidebar_pages/settings/SettingsPage';
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
import ResultPrecinctListPage from './pages/sidebar_pages/results/ResultPrecinctListPage';
import ResultPrecinctContestPage from './pages/sidebar_pages/results/ResultPrecinctContestPage';
import ValidatorListPage from './pages/sidebar_pages/user_management/validators/ValidatorListPage';
import ValidatorFormPage from './pages/sidebar_pages/user_management/validators/ValidatorFormPage';
import ValidatorFormEditPage from './pages/sidebar_pages/user_management/validators/ValidatorFormEditPage';
import { getUserSession } from './utils/functions';
import MyValidationListPage from './pages/sidebar_pages/validations/MyValidationListPage';
import ValidationPrecinctListPage from './pages/sidebar_pages/validations/ValidationPrecinctListPage';
import ValidationPrecinctDetailsPage from './pages/sidebar_pages/validations/ValidationPrecinctDetailsPage';
import ResultSummaryPage from './pages/sidebar_pages/results/ResultSummaryPage';

const defaultRoutes = [
    {
        path: "login",
        element: <LoginPage />,
        errorElement: <PageNotFound />
    },
    {
        path: "forgot-password",
        element: <ForgotPasswordPage />,
        errorElement: <PageNotFound />
    },
    {
        path: "/page-not-found",
        element: <PageNotFound />,
    },
    {
        path: "*",
        element: <Navigate to="/page-not-found" />,
    },
];

const adminRoutes = [
    {
        path: "validations",
        children: [
            {
                path: "/validations",
                element: <SideNavLayout> <ValidationPrecinctListPage /> </SideNavLayout>,
                errorElement: <PageNotFound />,
            },
            {
                path: "/validations/:id",
                element: <SideNavLayout> <ValidationPrecinctDetailsPage /> </SideNavLayout>,
                errorElement: <PageNotFound />,
            },
        ],
    },
    {
        path: "summary",
        element: <SideNavLayout> <ResultSummaryPage /> </SideNavLayout>,
        errorElement: <PageNotFound />,
    },
    {
        path: "upload-results",
        element: <SideNavLayout> <UploadResultListPage /> </SideNavLayout>,
        errorElement: <PageNotFound />,
    },
    {
        path: "settings",
        element: <SideNavLayout> <SettingsPage /> </SideNavLayout>,
        errorElement: <PageNotFound />,
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
            {
                path: "/user-management/validators",
                element: <SideNavLayout> <ValidatorListPage /> </SideNavLayout>,
                errorElement: <PageNotFound />,
            },
            {
                path: "/user-management/validators/new",
                element: <SideNavLayout> <ValidatorFormPage /> </SideNavLayout>,
                errorElement: <PageNotFound />,
            },
            {
                path: "/user-management/validators/:id",
                element: <SideNavLayout> <ValidatorFormEditPage /> </SideNavLayout>,
                errorElement: <PageNotFound />,
            },
        ],
    },
];

const finalValidatorRoutes = [
    {
        path: "results",
        children: [
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
                element: <SideNavLayout> <ResultPrecinctListPage /> </SideNavLayout>,
                errorElement: <PageNotFound />,
            },
            {
                path: "/results/precincts/:id",
                element: <SideNavLayout> <ResultPrecinctContestPage /> </SideNavLayout>,
                errorElement: <PageNotFound />,
            },
        ],
    },
    {
        path: "election-returns",
        element: <SideNavLayout> <ElectionReturnsListPage /> </SideNavLayout>,
        errorElement: <PageNotFound />,
    },
];

const initialValidatorRoutes = [
    {
        path: "",
        element: <SideNavLayout> <NationalElectionListPage /> </SideNavLayout>,
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
];

const validatorRoutes = [
    {
        path: "validations",
        children: [
            {
                path: "/validations/completed-validations",
                element: <SideNavLayout> <MyValidationListPage /> </SideNavLayout>,
                errorElement: <PageNotFound />,
            },
            {
                path: "/validations/for-validations",
                element: <SideNavLayout> <ValidationPrecinctListPage /> </SideNavLayout>,
                errorElement: <PageNotFound />,
            },
            {
                path: "/validations/for-validations/:id",
                element: <SideNavLayout> <ValidationPrecinctDetailsPage /> </SideNavLayout>,
                errorElement: <PageNotFound />,
            },
        ],
    },
];

function App() {

    // localStorage - use for long term use.
    // sessionStorage - use when you need to store something that changes or something
    let session = getUserSession();
    let routes = [];

    if (!session) {
        routes = [
            ...defaultRoutes,
            {
                path: "",
                element: <LoginPage />,
                errorElement: <PageNotFound />
            }
        ];
    } else {
        switch (session.user.role) {
            case "Administrator":
                routes = [...defaultRoutes, ...initialValidatorRoutes, ...finalValidatorRoutes, ...adminRoutes];
                break;
            case "Final Validator":
                routes = [...defaultRoutes, ...initialValidatorRoutes, ...validatorRoutes, ...finalValidatorRoutes];
                break;
            case "Initial Validator":
                routes = [...defaultRoutes, ...initialValidatorRoutes, ...validatorRoutes];
                break;
            default:
                routes = defaultRoutes;
        }
    }

    return (
        <RouterProvider router={createBrowserRouter(routes)} />
    );
}

export default App;