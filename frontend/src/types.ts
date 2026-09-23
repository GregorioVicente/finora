export type Transaction = { id:number; date:string; description:string; amount:number; category:string }
export type Dashboard = { income:number; expenses:number; balance:number; transactionCount:number; categories:Record<string,number>; evolution:{month:string;income:number;expenses:number}[] }
export type Budget = { id:number; month:string; category:string; limitAmount:number; spent:number }
export type Auth = { token:string; name:string; email:string }
