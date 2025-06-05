'use server';

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addNewUserAction(formData, pathToRevalidate) {
    const data = Object.fromEntries(formData.entries());

    await prisma.expense.create({
        data: { expName: data.expName, expPrice: parseFloat(data.expPrice), expDesc: data.expDesc, expQuantity: parseInt(data.expQuantity), expDate: new Date(data.expDate)  }
    });

    revalidatePath(pathToRevalidate);
    return { success: true };
}

export async function fetchUserAction() {
    const users = await prisma.expense.findMany({
        orderBy: { createdAt: "desc" }
    });
    return users;
}

export async function deleteUserAction(currentUserId, pathToRevalidate) {
    await prisma.expense.delete({
        where: { id: currentUserId }
    });
    revalidatePath(pathToRevalidate);
    return { success: true };
}

export async function editUserAction(currentUserId, formData, pathToRevalidate) {
    const data = Object.fromEntries(formData.entries());

    await prisma.expense.update({
        where: { id: currentUserId },
        data: { expName: data.expName, expPrice: parseFloat(data.expPrice), expDesc: data.expDesc, expQuantity: parseInt(data.expQuantity), expDate: new Date(data.expDate)  }
    });

    revalidatePath(pathToRevalidate);
    return { success: true };
}