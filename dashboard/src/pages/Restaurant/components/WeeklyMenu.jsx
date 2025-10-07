import React, { useEffect, useMemo, useState } from 'react';
import { mealService, restaurantService } from '../../../services/restaurantService';

const WeeklyMenu = () => {
  const [selectedDay, setSelectedDay] = useState('sun');
  const [availableMeals, setAvailableMeals] = useState([]); // type "Meal"
  const [availableSoups, setAvailableSoups] = useState([]); // type "Soup"
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');
  const [newMeal, setNewMeal] = useState({ title: '', description: '', type: 'Meal' });

  // Per-day selections: two meals + one soup
  const initialSelections = useMemo(() => ({
    sat: { meal1: '', meal2: '', soup: '' },
    sun: { meal1: '', meal2: '', soup: '' },
    mon: { meal1: '', meal2: '', soup: '' },
    tue: { meal1: '', meal2: '', soup: '' },
    wed: { meal1: '', meal2: '', soup: '' },
    thu: { meal1: '', meal2: '', soup: '' },
    fri: { meal1: '', meal2: '', soup: '' },
  }), []);
  const [weekSelections, setWeekSelections] = useState(initialSelections);
  const [originalSelections, setOriginalSelections] = useState(initialSelections);

  const days = [
    { key: 'sat', label: 'Sat', date: '22 Sep 2025', fullName: 'Saturday' },
    { key: 'sun', label: 'Sun', date: '23 Sep 2025', fullName: 'Sunday' },
    { key: 'mon', label: 'Mon', date: '24 Sep 2025', fullName: 'Monday' },
    { key: 'tue', label: 'Tue', date: '25 Sep 2025', fullName: 'Tuesday' },
    { key: 'wed', label: 'Wed', date: '26 Sep 2025', fullName: 'Wednesday' },
    { key: 'thu', label: 'Thu', date: '27 Sep 2025', fullName: 'Thursday' },
    { key: 'fri', label: 'Fri', date: '28 Sep 2025', fullName: 'Friday' }
  ];

  const mealCategories = ['Meal 1', 'Meal 2', 'Soup'];

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError('');
      try {
        const [meals, soups, weeklyMenuData] = await Promise.all([
          mealService.listMeals({ type: 'Meal' }),
          mealService.listMeals({ type: 'Soup' }),
          restaurantService.getWeeklyMenu(),
        ]);
        setAvailableMeals(meals);
        setAvailableSoups(soups);
        
        // Load existing weekly menu data
        if (weeklyMenuData && weeklyMenuData.length > 0) {
          const loadedSelections = { ...initialSelections };
          weeklyMenuData.forEach(dayMenu => {
            const dayKey = days.find(d => d.fullName === dayMenu.day)?.key;
            if (dayKey) {
              const mealIds = dayMenu.meals?.map(m => m._id || m.id) || [];
              const soupIds = dayMenu.soups?.map(s => s._id || s.id) || [];
              loadedSelections[dayKey] = {
                meal1: mealIds[0] || '',
                meal2: mealIds[1] || '',
                soup: soupIds[0] || '',
              };
            }
          });
          setWeekSelections(loadedSelections);
          setOriginalSelections(loadedSelections);
        }
      } catch (err) {
        setError(err.message || 'Failed to load meals');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const updateSelection = (categoryKey, id) => {
    setWeekSelections(prev => ({
      ...prev,
      [selectedDay]: { ...prev[selectedDay], [categoryKey]: id },
    }));
  };

  const handleSaveWeeklyMenu = async () => {
    setIsSaving(true);
    setError('');
    setSaveSuccess('');
    try {
      // Save each day's menu to the database
      const savePromises = days.map(async (day) => {
        const selections = weekSelections[day.key];
        const meals = [selections.meal1, selections.meal2].filter(Boolean);
        const soups = [selections.soup].filter(Boolean);
        
        return restaurantService.updateWeeklyMenu({
          day: day.fullName,
          meals,
          soups,
        });
      });
      
      await Promise.all(savePromises);
      setOriginalSelections(weekSelections);
      setSaveSuccess('Weekly menu updated successfully!');
      setTimeout(() => setSaveSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save weekly menu');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setWeekSelections(originalSelections);
    setError('');
    setSaveSuccess('');
  };

  const idToMeal = useMemo(() => new Map([...availableMeals, ...availableSoups].map(m => [m._id || m.id, m])), [availableMeals, availableSoups]);

  const resolvedMenu = useMemo(() => {
    const result = {};
    for (const d of days) {
      const sel = weekSelections[d.key];
      const entries = [sel.meal1, sel.meal2, sel.soup]
        .filter(Boolean)
        .map(id => idToMeal.get(id))
        .filter(Boolean)
        .map(m => ({ name: m.title || m.name, description: m.description || '' }));
      result[d.key] = entries;
    }
    return result;
  }, [idToMeal, weekSelections, days]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Edit Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center mb-6">
          <div className="w-1 h-6 bg-purple-600 mr-3"></div>
          <h2 className="text-xl font-semibold text-gray-900">Weekly Menu</h2>
        </div>

        {/* Success/Error Messages */}
        {saveSuccess && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            {saveSuccess}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="mb-4 text-center text-gray-600">Loading menu data...</div>
        )}

        {/* Day Selection */}
        <div className="flex space-x-2 mb-6">
          {days.map((day) => (
            <button
              key={day.key}
              onClick={() => setSelectedDay(day.key)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedDay === day.key
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {day.label}
            </button>
          ))}
        </div>

        {/* Render only tiles for meals added via modal for the selected day */}
        <div className="space-y-4 mb-6">
          {['meal1','meal2','soup'].map((slot) => {
            const id = weekSelections[selectedDay][slot];
            if (!id) return null;
            const item = idToMeal.get(id);
            if (!item) return null;
            return (
              <div key={slot}>
                <div className="text-sm font-medium text-gray-700 mb-1">{slot === 'soup' ? 'Soup' : (slot === 'meal1' ? 'Meal 1' : 'Meal 2')}</div>
                <div className="flex items-center justify-between p-4 bg-purple-600 text-white rounded-lg shadow-sm">
                  <div className="pr-3">
                    <h4 className="font-semibold">{item.title || item.name}</h4>
                    {item.description && <p className="text-sm text-white/90 mt-0.5">{item.description}</p>}
                  </div>
                  <button onClick={() => updateSelection(slot, '')} className="text-white/90 hover:text-white text-sm font-medium">
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add New Meal Button */}
        <button onClick={() => setIsModalOpen(true)} className="w-full px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors mb-6">
          Add New Meal +
        </button>

        <p className="text-sm text-gray-500 mb-6">
          Please make sure to add at least two meals per day in the weekly menu, This helps ensure variety and a complete dining experience for our guests.
        </p>

        {/* Selected summary removed per request; preview on the right reflects additions */}

        {/* Action Buttons */}
        <div className="flex gap-4 w-full mt-2 px-4 py-4">
          <button 
            onClick={handleCancel}
            disabled={isSaving}
            className="w-full px-8 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button 
            onClick={handleSaveWeeklyMenu}
            disabled={isSaving}
            className="w-full px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Update'}
          </button>
        </div>
      </div>

      {/* Display Section */}
      <div className="bg-gray-900 p-6 rounded-lg text-white border border-gray-800">
        <div className="flex items-center mb-6">
          <div className="w-1 h-6 bg-purple-400 mr-3"></div>
          <h2 className="text-3xl font-serif font-semibold">Weekly Menu</h2>
        </div>

        <div className="space-y-6 max-h-[32rem] overflow-y-auto pr-2">
          {Object.entries(resolvedMenu).map(([dayKey, meals]) => {
            const day = days.find(d => d.key === dayKey);
            return (
              <div key={dayKey} className="border-b border-gray-800 pb-4 last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold text-purple-400">{day?.label}</h3>
                  <span className="text-xs text-gray-400">{day?.date}</span>
                </div>
                <div className="space-y-2">
                  {meals.map((meal, index) => (
                    <div key={index} className="text-sm">
                      <div className="font-medium text-white">{meal.name}</div>
                      <div className="text-gray-300">{meal.description}</div>
                    </div>
                  ))}
                  {meals.length === 0 && (
                    <div className="text-xs text-gray-500">No selections yet.</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Meal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-1 h-6 bg-purple-600 mr-3"></div>
              <h3 className="text-lg font-semibold text-gray-900">Add Meal</h3>
            </div>

            {modalError && <div className="mb-3 text-sm text-red-600">{modalError}</div>}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={newMeal.title}
                  onChange={(e) => setNewMeal({ ...newMeal, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Meal title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  rows={3}
                  value={newMeal.description}
                  onChange={(e) => setNewMeal({ ...newMeal, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Describe the meal"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={newMeal.type}
                  onChange={(e) => setNewMeal({ ...newMeal, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Meal">Meal</option>
                  <option value="Soup">Soup</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 w-full mt-6">
              <button
                onClick={() => { setIsModalOpen(false); setModalError(''); setNewMeal({ title: '', description: '', type: 'Meal' }); }}
                className="w-full px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={modalSubmitting}
                onClick={async () => {
                  setModalSubmitting(true);
                  setModalError('');
                  try {
                    const created = await mealService.createMeal({
                      title: newMeal.title,
                      description: newMeal.description,
                      type: newMeal.type,
                      isRecommended: false,
                    });
                    if (created.type === 'Soup') {
                      setAvailableSoups(prev => [created, ...prev]);
                      // fill soup slot if empty
                      setWeekSelections(prev => ({
                        ...prev,
                        [selectedDay]: { ...prev[selectedDay], soup: prev[selectedDay].soup || (created._id || created.id) },
                      }));
                    } else {
                      setAvailableMeals(prev => [created, ...prev]);
                      // fill meal1 then meal2 if empty
                      setWeekSelections(prev => {
                        const cur = prev[selectedDay];
                        const firstEmpty = !cur.meal1 ? 'meal1' : (!cur.meal2 ? 'meal2' : null);
                        return firstEmpty ? { ...prev, [selectedDay]: { ...cur, [firstEmpty]: (created._id || created.id) } } : prev;
                      });
                    }
                    setIsModalOpen(false);
                    setNewMeal({ title: '', description: '', type: 'Meal' });
                  } catch (err) {
                    setModalError(err.message || 'Failed to add meal');
                  } finally {
                    setModalSubmitting(false);
                  }
                }}
                className="w-full px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-60"
              >
                {modalSubmitting ? 'Adding...' : 'Add Meal'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyMenu;


