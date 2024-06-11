import { NextResponse ,NextRequest} from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '../../../lib/connectDB';
import User from '../../../db_models/user';


export async function POST(req: NextRequest){
	await connectToDatabase();
	
	const { id, factoryAddress } = await req.json();
	
    const user = await User.findById(id);

    user.factoryAddress = factoryAddress;

	await user.save();

	return NextResponse.json({ status: 200, message: user });
}

// get factoryAddress of a user 
export async function GET(request: NextRequest) {

	const searchParams = request.nextUrl.searchParams
	const id = searchParams.get('id')

	await connectToDatabase();

	if (id) { 
		const user = await User.findById(id);
		if (user) return NextResponse.json({ status: 200, message: user.factoryAddress })
		else return NextResponse.json({ error: 'User Doesn\'t Exists' }, { status: 500 })

	} else {  
		return NextResponse.json({ status: 500, message: "Add id field to query"});
	}

}

export async function OPTIONS(){
	return NextResponse.json({ status: 200});
}