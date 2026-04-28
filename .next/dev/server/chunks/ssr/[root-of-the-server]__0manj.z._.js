module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[project]/Desktop/minckmedia/nexora.xyz/config/auth-config.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * NEXORA - Demo Authentication Configuration
 * 
 * This is a PROTOTYPE authentication system for demo purposes only.
 */ __turbopack_context__.s([
    "AUTH_STORAGE_KEY",
    ()=>AUTH_STORAGE_KEY,
    "demoUsers",
    ()=>demoUsers,
    "getAllUsers",
    ()=>getAllUsers,
    "getUserById",
    ()=>getUserById,
    "getUsersByStatus",
    ()=>getUsersByStatus,
    "isEmailTaken",
    ()=>isEmailTaken,
    "isUsernameTaken",
    ()=>isUsernameTaken,
    "validateLogin",
    ()=>validateLogin
]);
const demoUsers = [
    {
        id: "1",
        username: "admin",
        email: "admin@nexora.dev",
        password: "admin123",
        avatar: "/avatars/admin.png",
        role: "admin",
        level: 50,
        xp: 250000,
        createdAt: "2024-01-01",
        status: "active"
    },
    {
        id: "2",
        username: "player",
        email: "player@nexora.dev",
        password: "player123",
        avatar: "/avatars/player.png",
        role: "user",
        level: 24,
        xp: 7840,
        createdAt: "2024-02-15",
        status: "active"
    },
    {
        id: "3",
        username: "gamer42",
        email: "gamer42@nexora.dev",
        password: "gamer123",
        avatar: "/avatars/gamer.png",
        role: "user",
        level: 15,
        xp: 2250,
        createdAt: "2024-03-10",
        status: "active"
    },
    {
        id: "4",
        username: "ProPlayer99",
        email: "proplayer@nexora.dev",
        password: "pro123",
        avatar: "/avatars/proplayer.png",
        role: "user",
        level: 38,
        xp: 14440,
        createdAt: "2024-01-20",
        status: "active"
    },
    {
        id: "5",
        username: "NightOwl",
        email: "nightowl@nexora.dev",
        password: "night123",
        avatar: "/avatars/nightowl.png",
        role: "user",
        level: 8,
        xp: 640,
        createdAt: "2024-04-01",
        status: "timeout",
        timeoutUntil: "2024-12-20"
    },
    {
        id: "6",
        username: "ToxicUser",
        email: "toxic@nexora.dev",
        password: "toxic123",
        avatar: "/avatars/toxic.png",
        role: "user",
        level: 12,
        xp: 1440,
        createdAt: "2024-02-28",
        status: "banned",
        banReason: "Harassment and toxic behavior"
    },
    {
        id: "7",
        username: "CasualGamer",
        email: "casual@nexora.dev",
        password: "casual123",
        avatar: "/avatars/casual.png",
        role: "user",
        level: 5,
        xp: 250,
        createdAt: "2024-05-15",
        status: "active"
    },
    {
        id: "8",
        username: "SpeedRunner",
        email: "speed@nexora.dev",
        password: "speed123",
        avatar: "/avatars/speed.png",
        role: "user",
        level: 42,
        xp: 17640,
        createdAt: "2024-01-05",
        status: "active"
    }
];
function validateLogin(usernameOrEmail, password) {
    const user = demoUsers.find((u)=>(u.username.toLowerCase() === usernameOrEmail.toLowerCase() || u.email.toLowerCase() === usernameOrEmail.toLowerCase()) && u.password === password);
    return user || null;
}
function isUsernameTaken(username) {
    return demoUsers.some((u)=>u.username.toLowerCase() === username.toLowerCase());
}
function isEmailTaken(email) {
    return demoUsers.some((u)=>u.email.toLowerCase() === email.toLowerCase());
}
function getUserById(id) {
    return demoUsers.find((u)=>u.id === id) || null;
}
function getAllUsers() {
    return demoUsers;
}
function getUsersByStatus(status) {
    return demoUsers.filter((u)=>u.status === status);
}
const AUTH_STORAGE_KEY = 'nexora_auth_user';
}),
"[project]/Desktop/minckmedia/nexora.xyz/context/auth-context.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$minckmedia$2f$nexora$2e$xyz$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/minckmedia/nexora.xyz/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * NEXORA - Demo Authentication Context
 * 
 * PROTOTYPE ONLY - Not for production use
 * This provides a simple auth state management using React Context and localStorage.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$minckmedia$2f$nexora$2e$xyz$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/minckmedia/nexora.xyz/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$minckmedia$2f$nexora$2e$xyz$2f$config$2f$auth$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/minckmedia/nexora.xyz/config/auth-config.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$minckmedia$2f$nexora$2e$xyz$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AuthProvider({ children }) {
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$minckmedia$2f$nexora$2e$xyz$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$minckmedia$2f$nexora$2e$xyz$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    // Restore session on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$minckmedia$2f$nexora$2e$xyz$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const storedUser = localStorage.getItem(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$minckmedia$2f$nexora$2e$xyz$2f$config$2f$auth$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AUTH_STORAGE_KEY"]);
        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
                const validUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$minckmedia$2f$nexora$2e$xyz$2f$config$2f$auth$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getUserById"])(parsed.id);
                if (validUser && validUser.status === 'active') {
                    setUser(validUser);
                } else {
                    localStorage.removeItem(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$minckmedia$2f$nexora$2e$xyz$2f$config$2f$auth$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AUTH_STORAGE_KEY"]);
                }
            } catch  {
                localStorage.removeItem(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$minckmedia$2f$nexora$2e$xyz$2f$config$2f$auth$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AUTH_STORAGE_KEY"]);
            }
        }
        setIsLoading(false);
    }, []);
    const login = async (usernameOrEmail, password)=>{
        // Simulate network delay for realistic UX
        await new Promise((resolve)=>setTimeout(resolve, 500));
        const validUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$minckmedia$2f$nexora$2e$xyz$2f$config$2f$auth$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["validateLogin"])(usernameOrEmail, password);
        if (validUser) {
            // Check if user is banned or timed out
            if (validUser.status === 'banned') {
                return {
                    success: false,
                    error: `This account has been banned. Reason: ${validUser.banReason || 'No reason provided'}`
                };
            }
            if (validUser.status === 'timeout') {
                return {
                    success: false,
                    error: `This account is timed out until ${validUser.timeoutUntil}`
                };
            }
            // Don't store password in localStorage
            const safeUser = {
                ...validUser,
                password: undefined
            };
            localStorage.setItem(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$minckmedia$2f$nexora$2e$xyz$2f$config$2f$auth$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AUTH_STORAGE_KEY"], JSON.stringify(safeUser));
            setUser(validUser);
            return {
                success: true
            };
        }
        return {
            success: false,
            error: 'Invalid username/email or password'
        };
    };
    const logout = ()=>{
        localStorage.removeItem(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$minckmedia$2f$nexora$2e$xyz$2f$config$2f$auth$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AUTH_STORAGE_KEY"]);
        setUser(null);
    };
    const register = async (username, email, password)=>{
        // In prototype, just simulate registration
        await new Promise((resolve)=>setTimeout(resolve, 500));
        // For demo, create a new user session (won't persist across refreshes)
        const newUser = {
            id: `new_${Date.now()}`,
            username,
            email,
            password,
            avatar: '/avatars/default.png',
            role: 'user',
            level: 1,
            xp: 0,
            createdAt: new Date().toISOString().split('T')[0],
            status: 'active'
        };
        const safeUser = {
            ...newUser,
            password: undefined
        };
        localStorage.setItem(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$minckmedia$2f$nexora$2e$xyz$2f$config$2f$auth$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AUTH_STORAGE_KEY"], JSON.stringify(safeUser));
        setUser(newUser);
        return {
            success: true
        };
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$minckmedia$2f$nexora$2e$xyz$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            user,
            isLoading,
            isAuthenticated: !!user,
            login,
            logout,
            register
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/Desktop/minckmedia/nexora.xyz/context/auth-context.tsx",
        lineNumber: 108,
        columnNumber: 5
    }, this);
}
function useAuth() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$minckmedia$2f$nexora$2e$xyz$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/dynamic-access-async-storage.external.js [external] (next/dist/server/app-render/dynamic-access-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/dynamic-access-async-storage.external.js", () => require("next/dist/server/app-render/dynamic-access-async-storage.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0manj.z._.js.map