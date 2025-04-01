
const iconsList = {
    // "dashboard": <DashboardSvg />,
    // "catalog": <ChecklistSvg />,
    // "locations": <LocationSvg />,
    // "user_management": <UserSvg />,
    // "customer_management": <CustomerServiceSvg />,
}

const linksList = {
    "dashboard": "/dashboard",
    "catalog": "#",
    "locations": "#",
    "user_management": "#",
    "customer_management": "#",
    "brands": '/catalog/brands',
    "models": '/catalog/models',
    "attributes": '/catalog/attributes',
    "categories": '/catalog/categories',
    "barangay": '/locations/barangay',
    "province": '/locations/province',
    "city_municipality": '/locations/city_municipality',
    "customer_group": '/customer_management/customer_group',
    "customers": '/customer_management/customers',
    "users": '/user_management/users',
    "roles": '/user_management/roles',
}

const linksAccessList = {
    "dashboard": 1,
    "catalog": 0,
    "locations": 0,
    "user_management": 0,
    "customer_management": 0,
    "brands": 0,
    "models": 0,
    "attributes": 0,
    "categories": 0,
    "barangay": 0,
    "province": 0,
    "city_municipality": 0,
    "customer_group": 0,
    "customers": 0,
    "users": 0,
    "roles": 0,
}

const permissions1stlvl = {
    "dashboard": 'Dashboard',
    "catalog": 'Catalog Management',
    "locations": 'Location Management',
    "user_management": 'User Management',
    "customer_management": 'Customer Management',
}

const permissions2ndlvl = {
    "brands": 'Brands',
    "models": 'Models',
    "attributes": 'Attributes',
    "categories": 'Categories',
    "barangay": 'Barangays',
    "province": 'Provinces',
    "city_municipality": 'Cities / Minicipalities',
    "customer_group": 'Customer Group',
    "customers": 'Customers',
    "users": 'Users',
    "roles": 'Roles',
}

export {
    iconsList,
    permissions1stlvl,
    permissions2ndlvl,
    linksList,
    linksAccessList,
};