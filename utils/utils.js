const fetchIfPartial = async (partial) => {
    if (partial.partial) {
        try {
            await partial.fetch();
        } catch (error) {
            console.error('Reaction add: Error fetching partial:', error);
        }
    }
}

module.exports = {
    fetchIfPartial
}