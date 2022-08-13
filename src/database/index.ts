import config from 'config';
import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const mongoURI: string = config.get('mongoURI');
        await mongoose.connect(mongoURI, {
            dbName: 'game',
        });
        // tslint:disable-next-line:no-console
        console.log('MongoDB Connected...');
    } catch (err) {
        let message = 'Unkown error!';
        if (err instanceof Error) message = err.message;
        // tslint:disable-next-line:no-console
        console.error(message);
        // Exit process with failure
        process.exit(1);
    }
};

export default connectDB;
