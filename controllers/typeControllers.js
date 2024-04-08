const TypeModel = require("../model/type")


const createType =  async (req, res) => {
    try {
        const { typeName, steps } = req.body;

        // Check if typeName already exists
        const existingType = await TypeModel.findOne({ typeName });
        if (existingType) {
            return res.status(400).json({ error: 'Type with this name already exists' });
        }
        const updatedSteps = steps.map(step => ({ ...step, condition: false }));


        // Create a new type
        const newType = new TypeModel({ typeName, steps: updatedSteps });
        await newType.save();

        res.status(201).json({ message: "Type Created Successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};


 const fetchSingleType =  async (req, res) => {
    try {
        const type = await TypeModel.findById(req.params.id);
        if (!type) {
            return res.status(404).json({ error: 'Type not found' });
        }
        res.json(type);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

const fetchSingleTypeUpdate = async (req, res) => {
    try {
        const { typeName, steps } = req.body;

        // Check if typeName already exists
        const existingType = await TypeModel.findOne({ typeName });
        if (existingType && existingType._id.toString() !== req.params.id) {
            return res.status(400).json({ error: 'Type with this name already exists' });
        }

        const updatedSteps = steps.map(step => ({ ...step, condition: false }));

        const updatedType = await TypeModel.findByIdAndUpdate(req.params.id, { typeName, steps: updatedSteps }, { new: true });
        if (!updatedType) {
            return res.status(404).json({ error: 'Type not found' });
        }
        res.json({ message: "Updated Successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// GET route to fetch only _id and typeName of all types
const fetchAllTypes = async (req, res) => {
    try {
        const types = await TypeModel.find({}, '_id typeName');
        res.json(types);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports ={
    createType,
    fetchSingleType,
    fetchSingleTypeUpdate,
    fetchAllTypes
}