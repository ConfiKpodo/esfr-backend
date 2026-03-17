const TransportAgent = require("../models/transportation.model");

/**
 * Create new transport agent
 */
exports.createAgent = async (req, res) => {
  try {
    const { agentName, email, phone, location, postalAddress, truckType } = req.body;

    const photo = req.file ? `/uploads/agents/${req.file.filename}` : "";

    const agent = new TransportAgent({
      agentName,
      email,
      phone,
      location,
      postalAddress,
      truckType,
      photo,
    });

    await agent.save();

    res.status(201).json({ message: "Agent created", agent });
  } catch (err) {
    console.error("Create Agent Error:", err.message);
    res.status(500).json({ error:err.message || "Failed to create agent" });
  }
};

/**
 * Get all agents
 */
exports.getAllAgents = async (req, res) => {
  try {
    const agents = await TransportAgent.find().sort({ createdAt: -1 });
    res.status(200).json(agents);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch agents" });
  }
};

/**
 * Get single agent by ID
 */
exports.getAgentById = async (req, res) => {
  try {
    const agent = await TransportAgent.findById(req.params.id);

    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    res.status(200).json(agent);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch agent" });
  }
};

/**
 * Search agent by name or truck type (partial match)
 */
exports.searchAgents = async (req, res) => {
  try {
    const { name } = req.params;

    if (!name) {
      return res.status(400).json({ message: "Search term required" });
    }

    const agents = await TransportAgent.find({
      $or: [
        { agentName: { $regex: name, $options: "i" } },
        { truckType: { $regex: name, $options: "i" } },
        { location: { $regex: name, $options: "i" } }
      ]
    });

    res.status(200).json(agents);
  } catch (err) {
    res.status(500).json({ error: "Search failed" });
  }
};
/**
 * Update agent
 */
exports.updateAgent = async (req, res) => {
  try {
    const { agentName, email, phone, location, postalAddress, truckType } = req.body;

    const updateData = {
      agentName,
      email,
      phone,
      location,
      postalAddress,
      truckType,
    };

    if (req.file) {
      updateData.photo = `/uploads/agents/${req.file.filename}`;
    }

    const agent = await TransportAgent.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.status(200).json({ message: "Agent updated", agent });
  } catch (err) {
    res.status(500).json({ error: "Failed to update agent" });
  }
};

/**
 * Delete agent
 */
exports.deleteAgent = async (req, res) => {
  try {
    await TransportAgent.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Agent deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete agent" });
  }
};
