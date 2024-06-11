import { NextResponse ,NextRequest} from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '../../lib/connectDB';
import User from '../../db_models/user';

// add hotel
export async function POST(req: NextRequest){
	await connectToDatabase();
	
	const { name, password } = await req.json();
	

	// add account info to User db
	const newUser = new User({
		name,
		password
	});

	await newUser.save();

	return NextResponse.json({ status: 200, message: {id: newUser._id} });
}

// list all/one user
export async function GET(request: NextRequest) {

	const searchParams = request.nextUrl.searchParams
	const id = searchParams.get('id')

	await connectToDatabase();

	if (id) { // list one specific hotel
		const user = await User.findById(id);
		if (user) return NextResponse.json({ status: 200, message: user })
		else return NextResponse.json({ error: 'User Doesn\'t Exists' }, { status: 500 })

	} else {  // list all hotels
		const users = await User.find({}).exec();
		return NextResponse.json({ status: 200, message: users });
	}

}

export async function OPTIONS(){
	return NextResponse.json({ status: 200});
}