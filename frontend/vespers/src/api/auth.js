import API from "./axios";

export const registerUser = async (userData) => {
    const res = await API.post("/auth/register", userData);

    if(res.data.token){
        localStorage.setItem("token", res.data.token);
    }

    return res.data;
};


export const loginUser = async(userData) => {
    const res = await API.post("/auth/login",userData);

    if(res.data.token){
        localStorage.setItem("token",res.data.token);
    }

    return res.data;
};

export const getProfile = async()=> {
    const res = await API.get("/user/profile");

    return res.data;
};