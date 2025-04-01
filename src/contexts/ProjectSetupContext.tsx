import { ReactNode, useContext, useState, createContext } from "react";

interface ProjectSetupType {
    project: {
        id?: string,
        name: string,
        description?: string,
        developerId?: string,
        contactPerson?: string,
        contactNumer?: string,
        contactEmail?: string,
        type?: string,
        status?: string,
        lotArea?: number,
        floorArea?: number,
        attachments?: string[],
    },
    structures: any,
    floors: any,
    units: any,
}
interface ProjectSetupContextType {
    projectData: ProjectSetupType;
    setProject: (data: any) => void;
}

const ProjectSetupContext = createContext<ProjectSetupContextType | undefined>(undefined);

const ProjectSetupProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [projectData, setProjectData] = useState<any>(null);

    const setProject = (data: any) => {
        setProjectData(data);
    };

    return (
        <ProjectSetupContext.Provider value={{ projectData, setProject }}>
            {children}
        </ProjectSetupContext.Provider>
    );
};

const useProjectSetup = (): ProjectSetupContextType => {
    const context = useContext(ProjectSetupContext);
    if (!context) {
        throw new Error("useProjectSetup must be used within a ProjectSetupProvider");
    }
    return context;
};

export { ProjectSetupProvider, useProjectSetup };
