import { ReactNode, useContext, useState, createContext } from "react";

interface AccordionContextProps {
    items: any;
    getItems: () => any[];
    initItems: (data: any[]) => void;
    moveItem: (from: number, to: number) => void;
    removeItem: (index: number) => void;
    toggleItem: (index: number) => void;
    updateItem: (index: number, key: string, value: any, isArray: boolean, accessor?: string) => void;
    addItem: (data: any) => void;
}

const AccordionContext = createContext<AccordionContextProps | undefined>(undefined);

const AccordionProvider = ({ children }: { children: ReactNode }) => {
    const [items, setItems] = useState<any[]>([]);

    const moveItem = (from: number, to: number) => {
        const updatedItems = [...items];
        const movedItem = updatedItems.splice(from, 1);
        updatedItems.splice(to, 0, movedItem[0]);
        setItems(updatedItems);
    };

    const getItems = () => {
        return items;
    }

    const initItems = (data: any[]) => {
        setItems(data);
    }

    const addItem = (data: any) => {
        setItems([...items, data]);
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const toggleItem = (index: number) => {
        setItems(items.map((item, i) => (i === index ? { ...item, open: !item.open } : item)));
    };

    const updateItem = (index: number, key: string, value: any, isArray: boolean, accessor?: string) => {
        if (isArray) {
            setItems(items.map((item, i) => (i === index ? { ...item, [key]: value } : item)));
        } else {
            if (accessor) {
                setItems(
                    (prev: any) => ({
                        ...prev,
                        [accessor]: (prev[accessor] || []).map((item: any, i: number) => {
                            return i === index ? { ...item, [key]: value } : item;
                        }),
                    }),
                );

            }
        }
    };

    return (
        <AccordionContext.Provider value={{ items, moveItem, removeItem, toggleItem, addItem, updateItem, initItems, getItems }}>
            {children}
        </AccordionContext.Provider>
    );
};

const useAccordion = () => {
    const context = useContext(AccordionContext);
    if (!context) {
        throw new Error("useAccordion must be used within an AccordionProvider");
    }
    return context;
};

export { AccordionProvider, useAccordion };
