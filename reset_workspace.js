// Reset workspace password - run this in browser console
// Delete and recreate workspace with correct password

const workspaceId = 'winslow_main';
const password = 'WinDev2026@@';

async function resetWorkspace() {
    const db = firebase.database();
    const workspaceRef = db.ref(`workspaces/${workspaceId}`);
    
    // Delete existing
    await workspaceRef.remove();
    console.log('Workspace deleted');
    
    // Hash password
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const passwordHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    // Create new
    await workspaceRef.set({
        passwordHash: passwordHash,
        createdAt: Date.now()
    });
    console.log('Workspace created with new password');
}

resetWorkspace();
