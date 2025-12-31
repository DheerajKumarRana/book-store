try {
    require.resolve('next-auth/middleware');
    console.log('Found next-auth/middleware');
} catch (e) {
    console.error('NOT FOUND', e);
}
