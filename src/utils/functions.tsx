import moment from "moment";
import { redirect } from "react-router-dom";

const boolValue = (item: any) => {
    item = typeof (item) === "string" ? item.trim().toLowerCase() : item;
    return [true, 1, 'true'].includes(item);
}

const getUserSession = () => {
    const user = localStorage.getItem('user');
    if (user) {
        if (user === 'undefined') {
            localStorage.removeItem('user');
            return null;
        }

        return JSON.parse(user);
    }
    return null;
}

const saveUserSession = (data: any) => {
    localStorage.setItem('user', JSON.stringify(data));
}

const saveActiveBatchNumber = (data: any) => {
    localStorage.setItem("activeBatch", data);
}

const getActiveBatchNumber = () => {
    const batch = localStorage.getItem('activeBatch');
    if (batch) {
        if (batch === 'undefined') {
            localStorage.removeItem('activeBatch');
            return null;
        }

        return batch;
    }
    return null;
}

const prepareLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
}

const convertImage = async (file: File) => {
    const reader = new FileReader();
    const threshold = 1024 * 100;
    const value = file.size / threshold;

    const imageBitmap: ImageBitmap = await createImageBitmap(file); // Blob file

    reader.readAsDataURL(file);
    let base64Str = await new Promise((resolve, reject) => {
        reader.onloadend = async () => {
            if (value <= 1) {
                const result = reader.result?.toString();
                resolve(result);
            } else {
                const canvas = createCanvas(imageBitmap);
                const blob = await compressImageFromCanvas(threshold, canvas);

                reader.readAsDataURL(blob);
                reader.onloadend = async () => {
                    let blobRes = reader.result?.toString();
                    if (blobRes) {
                        resolve(blobRes);
                    } else {
                        reject(null);
                    }
                }
            }
        }
    });

    return base64Str;
};

const createCanvas = (imageBitmap: ImageBitmap, maxWidth = 800, maxHeight = 800) => {
    let { width, height } = imageBitmap;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (width > maxWidth || height > maxHeight) {
        if (width > height) {
            height = (maxHeight / width) * height;
            width = maxWidth;
        } else {
            width = (maxWidth / height) * width;
            height = maxHeight;
        }
    }

    canvas.width = width;
    canvas.height = height;
    ctx?.drawImage(imageBitmap, 0, 0, width, height);

    return canvas;
}

const compressImageFromCanvas = async (threshold: number, canvas: HTMLCanvasElement) => {
    // Compress the image iteratively to meet size requirements
    let quality = 1.0; // Start with full quality

    const toBlobPromise = (canvas: any, quality: any) =>
        new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));

    let blob: any = await toBlobPromise(canvas, quality);
    while (blob.size > threshold && quality > 0.1) {
        quality -= 0.1;
        blob = await toBlobPromise(canvas, quality);
        // console.log("compressed: ", blob.size, threshold);
    }

    return blob;
}

const fileToBase64 = async (file: File) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            if (reader.result) {
                resolve(reader.result.toString());
            }
        }
        reader.onerror = reject;
    });
}

const awaitTimeout = (delay: number) =>
    new Promise(resolve => setTimeout(resolve, delay));

const compareToday = (info: string) => {
    const date = new Date(info);

    if (date) {
        const today = new Date();
        if (date.toLocaleDateString('en-PH', { year: "numeric", month: "short", day: "numeric" }) ===
            today.toLocaleDateString('en-PH', { year: "numeric", month: "short", day: "numeric" })) {
            return "Today " + date.toLocaleTimeString('en-PH', { hour: "numeric", minute: "numeric" });
        } else
            if (date.toLocaleDateString('en-PH', { year: "numeric" }) === today.toLocaleDateString('en-PH', { year: "numeric", })) {
                return date.toLocaleDateString('en-PH', { month: "short", day: "numeric", hour: "numeric", minute: "numeric" });
            } else {
                return new Date(info).toLocaleDateString('en-PH', { year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "numeric" });
            }
    }
    return '';
}

const currencyFormatter = (amount: number, currency: string = "PHP") => {
    const formatter = Intl.NumberFormat('en', {
        currency: currency,
        style: 'currency',
    });
    return formatter.format(amount);
}

const formatDateString = (string: string, format: string = 'YYYY-MM-DD') => {
    return moment(string).format(format);
}

const toDate = (string: string, format?: string) => {
    return moment(string, format);
}

const convertBase64Blob = (base64: string) => {
    const base64Content = base64.split(",")[1];

    const byteCharacters = atob(base64Content);

    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);

    return new Blob([byteArray]);
};

const blobToFile = (blob: Blob, filename: string, type: string = "application/pdf") => {
    return new File([blob], filename, { type });
}

const downloadFile = (base64String: string, filename: string) => {
    const blob = convertBase64Blob(base64String);
    const file = blobToFile(blob, filename);

    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = file.name;
    link.click();
}

function generateCode(len: number, an: string) {
    const numeric = '0123456789';
    const aplha = 'abcdefghijklmnopqrstuvwxyz';

    let charPool, code = '';

    switch (an) {
        case 'n': charPool = numeric; break;
        case 'a': charPool = aplha + aplha.toUpperCase(); break;
        default: charPool = numeric + aplha + aplha.toUpperCase(); break;
    }

    for (let i = len; i > 0; i--) {
        code += charPool[(Math.floor(Math.random() * charPool.length))];
    }

    return code;
}

export {
    saveUserSession,
    getUserSession,
    awaitTimeout,
    boolValue,
    prepareLogout,
    createCanvas,
    compressImageFromCanvas,
    compareToday,
    currencyFormatter,
    formatDateString,
    toDate,
    convertBase64Blob,
    blobToFile,
    downloadFile,
    convertImage,
    fileToBase64,
    generateCode,
    getActiveBatchNumber,
    saveActiveBatchNumber,
}