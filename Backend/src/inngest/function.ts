import { Inngest } from "inngest";
import {functions as aiFunction} from "./aiFunction.js"

export const inngest = new Inngest({ id: "Calmry" });

export const functions = [
...aiFunction
];