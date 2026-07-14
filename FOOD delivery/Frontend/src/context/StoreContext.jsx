import { createContext, useEffect, useState } from "react";
import axios from "axios";


export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({});
    const url = "http://localhost:4000"
    const [token, setToken] = useState("");
    const [food_list,setFoodList] = useState([]);
    const fetchFoodList = async ()=>{
        const  response = await axios.get(url+"/api/food/list");
        setFoodList(response.data.data);
    }

    useEffect(()=>{
        async function loadData(){
            await fetchFoodList();
             if(localStorage.getItem("token")){
            setToken(localStorage.getItem("token"))
        }
        }
        loadData();
    },[])


    // Add item to cart
    const addToCart = (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({
                ...prev,
                [itemId]: 1,
            }));
        } else {
            setCartItems((prev) => ({
                ...prev,
                [itemId]: prev[itemId] + 1,
            }));
        }
    };


    const removeFromCart = (itemId) => {
        setCartItems((prev) => {
            if (!prev[itemId]) return prev;

            if (prev[itemId] === 1) {
                const updatedCart = { ...prev };
                delete updatedCart[itemId];
                return updatedCart;
            }

            return {
                ...prev,
                [itemId]: prev[itemId] - 1,
            };
        });
    };
    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item);
                if (itemInfo) {
                    totalAmount += itemInfo.price * cartItems[item];
                }
            }
        }
        return totalAmount;
    };


    useEffect(() => {
        console.log(cartItems);
    }, [cartItems])

    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;