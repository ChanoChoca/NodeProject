import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, required: true, default: 1 }
    }]
}, { versionKey: false });

export default mongoose.model('Cart', cartSchema);
