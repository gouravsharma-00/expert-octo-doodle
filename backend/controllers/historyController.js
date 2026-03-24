import DebugHistory from '../models/DebugHistory.js';

export const getHistory = async (req, res) => {
  try {
    const history = await DebugHistory.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving history' });
  }
};

export const deleteHistory = async (req, res) => {
  try {
    const recordId = req.params.id;
    const record = await DebugHistory.findById(recordId);

    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    if (record.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await record.deleteOne();
    res.json({ message: 'Record removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting history' });
  }
};
