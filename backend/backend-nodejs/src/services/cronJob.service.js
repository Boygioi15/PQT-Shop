import cron from 'node-cron';
import promotionModel from '../models/promotion.model.js';

cron.schedule('* * * * *', async () => {
    console.log('Cron job to activate promotions is running...');
    try {
        if (promotionsToActivate.modifiedCount > 0) {
            console.log(`Activated ${promotionsToActivate.modifiedCount} promotions`);
        }
    } catch (error) {
        console.error('Error in deactivating expired promotions:', error);
    }
});
