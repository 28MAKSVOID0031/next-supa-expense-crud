'use client';
import { useEffect, useState } from "react";
import { addNewUserAction, fetchUserAction, deleteUserAction, editUserAction } from "@/actions";
export default function Home () {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);

    async function HandleFetchUserData() {
        const allUsers = await fetchUserAction();
        setUsers(allUsers);
    }

    useEffect(() => {
        HandleFetchUserData();
    }, []);

    async function HandleAddNewExpense(formData) {
        if (editingUser) {
            await editUserAction(editingUser.id, formData, "/");
            setEditingUser(null);
        } else {
            await addNewUserAction(formData, "/");
        }
        formData.set("username", "");
        HandleFetchUserData();
    }

    async function HandleDeleteExpenseData(currentUserId) {
        await deleteUserAction(currentUserId, "/");
        HandleFetchUserData();
    }

    function HandleEditExpenseData(user) {
        const form = document.getElementById("user-form");

        for (const key in user) {
            if (form.elements.namedItem(key)) {
                if (key === "expDate") {
                    const isoDate = new Date(user.expDate).toISOString().split("T")[0]; // "yyyy-MM-dd"
                    form.elements.namedItem("expDate").value = isoDate;
                } else {
                    form.elements.namedItem(key).value = user[key];
                }
            }
        }
        setEditingUser(user);
    }
    return (
        <>
            <header>
                <h1>Expense Report</h1>
            </header>
            <form id="user-form" action={HandleAddNewExpense}>
                <label>Expense Name</label>
                <input required type="text" id="expName" name="expName" placeholder="Enter Expense Name" /><br />
                <label>Expense Prise</label>
                <input required type="number" id="expPrice" name="expPrice" placeholder="Enter Expense Price" /><br />
                <label>Expense Description</label>
                <input required type="text" id="expDesc" name="expDesc" placeholder="Enter Expense Description" /><br />
                <label>Expense Quantity</label>
                <input required type="number" id="expQuantity" name="expQuantity" placeholder="Enter Expense Quantity" /><br />
                <label>Expense Date</label>
                <input required type="date" id="expDate" name="expDate" placeholder="Enter Expense Date" /><br />
                <input type="submit" value={editingUser ? "Update User" : "Add User"} />
            </form>
            <seciton>
                {
                    users.map(user => (
                        <div key={user.id}>
                            <p>{user?.expName}</p>
                            <p>{user?.expPrice}$</p>
                            <p>{user?.expDesc}</p>
                            <p>{user?.expQuantity}</p>
                            <p>{new Date(user?.expDate).toLocaleDateString()}</p>
                            <button onClick={() => HandleEditExpenseData(user)}>E</button>
                            <button onClick={() => HandleDeleteExpenseData(user.id)}>X</button>
                        </div>
                    ))
                }
            </seciton>
        </>
    );
}