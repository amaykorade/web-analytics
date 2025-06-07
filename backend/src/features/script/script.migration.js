import ScriptModel from "./script.schema.js";

export const migrateVerificationStatus = async () => {
    try {
        // Get all scripts
        const scripts = await ScriptModel.find({});
        console.log(`Found ${scripts.length} scripts to migrate`);

        // Update each script
        for (const script of scripts) {
            // Check if script was previously verified in localStorage
            const isVerified = script.isVerified || false;
            
            // Update the script with verification status
            await ScriptModel.findByIdAndUpdate(script._id, {
                isVerified,
                verifiedAt: isVerified ? new Date() : null
            });
            
            console.log(`Migrated script: ${script.websiteName} (${script._id})`);
        }

        console.log('Migration completed successfully');
    } catch (error) {
        console.error('Migration failed:', error);
    }
}; 