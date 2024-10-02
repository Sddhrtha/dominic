const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const db = require('./../config/db');
const order = db.getClient('order');

async function orderTracking(io) {
    try {
        // Watch the orders collection for changes
        const changeStream = order.watch();

        // Listen for changes and emit the status update to the frontend
        changeStream.on('change', (change) => {
            if (change.operationType === 'update') {
                const { operationType, documentKey, updateDescription} = change;
                console.log(updateDescription);
                io.emit('orderStatusUpdated', { operationType, _id: documentKey._id, status: updateDescription.updatedFields.delivery_status});  // Emit status to clients
            }
        });
    } catch (error) {
        console.error(error);
    }
}

// Export the run method so it can be used in other files
module.exports = { orderTracking };