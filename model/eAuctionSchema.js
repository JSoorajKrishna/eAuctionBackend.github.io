const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eAuctionSchema = new Schema({
    productname:{
        type: String,
        // required: true
    },
    productproperties:{
        type: String,
        // required: true
    },
    starttime:{
        type: Number,
        // required: true
    },
    productpicture:{
        data: Buffer,
        // ContentType: String,
        type: String,
        // required: true
    },
    auctionstartingamount:{
        type: Number,
        // required: true
    },
    auctionendingamount:{
        type: Number,
        // required: true
    },
    owneroftheproduct:{
        type: String,
        // required: true
    },
    auctiontakenby:{
        type: String,
        // required: true
    }
});

const Auction = mongoose.model("auction",eAuctionSchema);

module.exports = Auction;