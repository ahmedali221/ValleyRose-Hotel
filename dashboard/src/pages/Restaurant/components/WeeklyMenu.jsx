import React, { useEffect, useMemo, useState } from 'react';
import { mealService, restaurantService } from '../../../services/restaurantService';

const WeeklyMenu = () => {
  const [selectedDay, setSelectedDay] = useState('sun');
  const [availableMeals, setAvailableMeals] = useState([]); // type "Meal"
  const [availableSoups, setAvailableSoups] = useState([]); // type "Soup"
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
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

  // Calculate current week dates dynamically - memoized to prevent recreation on every render
  const days = useMemo(() => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    
    // Calculate the start of the week (Saturday)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDay - 1); // Go back to Saturday
    
    const daysArray = [];
    const dayNames = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const dayKeys = ['sat', 'sun', 'mon', 'tue', 'wed', 'thu', 'fri'];
    const dayLabels = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      
      const dayKey = dayKeys[i];
      const dayLabel = dayLabels[i];
      const fullName = dayNames[i];
      const dateStr = date.toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      });
      
      daysArray.push({
        key: dayKey,
        label: dayLabel,
        date: dateStr,
        fullName: fullName
      });
    }
    
    return daysArray;
  }, []); // Empty dependency array - calculate once on mount

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
            // Map backend day names to frontend day keys
            const dayMapping = {
              'Saturday': 'sat',
              'Sunday': 'sun', 
              'Monday': 'mon',
              'Tuesday': 'tue',
              'Wednesday': 'wed',
              'Thursday': 'thu',
              'Friday': 'fri'
            };
            const dayKey = dayMapping[dayMenu.day];
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
  }, []); // Empty dependency array - only run once on mount

  const updateSelection = (categoryKey, id) => {
    setWeekSelections(prev => ({
      ...prev,
      [selectedDay]: { ...prev[selectedDay], [categoryKey]: id },
    }));
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
          <div className="w-1 h-6 mr-3" style={{backgroundColor: 'var(--primary-color)'}}></div>
          <h2 className="text-xl font-semibold text-gray-900">Weekly Menu</h2>
        </div>

        {/* Error Messages */}
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
                  ? 'text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              style={selectedDay === day.key ? {backgroundColor: 'var(--primary-color)'} : {}}
            >
              {day.label}
            </button>
          ))}
        </div>

        {/* Simple list showing meal names only */}
        <div className="mb-6">
          {['meal1','meal2','soup'].map((slot) => {
            const id = weekSelections[selectedDay][slot];
            if (!id) return null;
            const item = idToMeal.get(id);
            if (!item) return null;
            return (
              <div key={slot} className="mb-3">
                <div className="text-sm font-medium text-gray-700 mb-1">
                  {slot === 'soup' ? 'Soup' : (slot === 'meal1' ? 'Meal 1' : 'Meal 2')}
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg" style={{backgroundColor: 'var(--primary-color)'}}>
                  <div className="flex-1">
                    <h4 className="font-medium text-white">{item.title || item.name}</h4>
                  </div>
                  <button 
                    className="ml-3 text-white"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add New Meal Button */}
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="w-full px-8 py-3 text-white rounded-lg transition-colors mb-6"
          style={{backgroundColor: 'var(--primary-color)'}}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'var(--primary-hover)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'var(--primary-color)';
          }}
        >
          Add New Meal +
        </button>

        <p className="text-sm text-gray-500 mb-6">
          Please make sure to add at least two meals per day in the weekly menu. This helps ensure variety and a complete dining experience for our guests.
        </p>

        {/* Detailed tiles view showing full meal information */}
        <div className="space-y-3 mb-6">
          {['meal1','meal2','soup'].map((slot) => {
            const id = weekSelections[selectedDay][slot];
            if (!id) return null;
            const item = idToMeal.get(id);
            if (!item) return null;
            return (
              <div key={slot} className="flex items-center justify-between py-2 px-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3 flex-1">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{backgroundColor: 'var(--primary-color)'}}></div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900">{item.title || item.name}</div>
                    {item.description && (
                      <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">{item.description}</div>
                    )}
                  </div>
                </div>
                <button 
                  onClick={async () => {
                    try {
                      // Get the full day name for the API
                      const currentDay = days.find(d => d.key === selectedDay);
                      const dayName = currentDay?.fullName;
                      const mealType = slot === 'soup' ? 'soups' : 'meals';
                      
                      // Remove from backend
                      await restaurantService.removeMealFromDay(dayName, id, mealType);
                      
                      // Update local state
                      updateSelection(slot, '');
                      setOriginalSelections(prev => ({
                        ...prev,
                        [selectedDay]: { ...prev[selectedDay], [slot]: '' }
                      }));
                    } catch (err) {
                      console.error('Failed to remove meal from day:', err);
                      setError(err.message || 'Failed to remove meal from day');
                    }
                  }} 
                  className="ml-3 text-red-600 hover:text-red-700 text-sm font-medium flex-shrink-0"
                >
                  Delete
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Display Section */}
      <div className="bg-gray-900 p-6 rounded-lg text-white border border-gray-800">
        <div className="flex items-center mb-6">
          <div className="w-1 h-6 mr-3" style={{backgroundColor: 'var(--primary-color)'}}></div>
          <h2 className="text-3xl font-semibold" style={{ fontFamily: "'Redressed', cursive" }}>Weekly Menu</h2>
        </div>

        <div className="space-y-6 max-h-[32rem] overflow-y-auto pr-2">
          {Object.entries(resolvedMenu).map(([dayKey, meals]) => {
            const day = days.find(d => d.key === dayKey);
            return (
              <div key={dayKey} className="border-b border-gray-800 pb-4 last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold" style={{color: 'var(--primary-color)'}}>{day?.label}</h3>
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
              <div className="w-1 h-6 mr-3" style={{backgroundColor: 'var(--primary-color)'}}></div>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                  style={{'--tw-ring-color': 'var(--primary-color)'}}
                  placeholder="Meal title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  rows={3}
                  value={newMeal.description}
                  onChange={(e) => setNewMeal({ ...newMeal, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                  style={{'--tw-ring-color': 'var(--primary-color)'}}
                  placeholder="Describe the meal"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={newMeal.type}
                  onChange={(e) => setNewMeal({ ...newMeal, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                  style={{'--tw-ring-color': 'var(--primary-color)'}}
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
                disabled={modalSubmitting || !newMeal.title.trim()}
                onClick={async () => {
                  if (!newMeal.title.trim()) {
                    setModalError('Please enter a meal title');
                    return;
                  }
                  setModalSubmitting(true);
                  setModalError('');
                  try {
                    const created = await mealService.createMeal({
                      title: newMeal.title,
                      description: newMeal.description,
                      type: newMeal.type,
                      isRecommended: false,
                    });
                    
                    // Get the full day name for the API
                    const currentDay = days.find(d => d.key === selectedDay);
                    const dayName = currentDay?.fullName;
                    
                    if (created.type === 'Soup') {
                      setAvailableSoups(prev => [created, ...prev]);
                      // Add to backend for this specific day
                      await restaurantService.addMealToDay(dayName, created._id || created.id, 'soups');
                      // fill soup slot if empty
                      setWeekSelections(prev => ({
                        ...prev,
                        [selectedDay]: { 
                          ...prev[selectedDay], 
                          soup: prev[selectedDay].soup || (created._id || created.id) 
                        },
                      }));
                    } else {
                      setAvailableMeals(prev => [created, ...prev]);
                      // Add to backend for this specific day
                      await restaurantService.addMealToDay(dayName, created._id || created.id, 'meals');
                      // fill meal1 then meal2 if empty
                      setWeekSelections(prev => {
                        const cur = prev[selectedDay];
                        const firstEmpty = !cur.meal1 ? 'meal1' : (!cur.meal2 ? 'meal2' : null);
                        if (firstEmpty) {
                          return { 
                            ...prev, 
                            [selectedDay]: { 
                              ...cur, 
                              [firstEmpty]: (created._id || created.id) 
                            } 
                          };
                        }
                        return prev;
                      });
                    }
                    
                    // Reload the weekly menu to sync with backend
                    const weeklyMenuData = await restaurantService.getWeeklyMenu();
                    if (weeklyMenuData && weeklyMenuData.length > 0) {
                      const loadedSelections = { ...initialSelections };
                      weeklyMenuData.forEach(dayMenu => {
                        const dayMapping = {
                          'Saturday': 'sat',
                          'Sunday': 'sun', 
                          'Monday': 'mon',
                          'Tuesday': 'tue',
                          'Wednesday': 'wed',
                          'Thursday': 'thu',
                          'Friday': 'fri'
                        };
                        const dayKey = dayMapping[dayMenu.day];
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
                    
                    setIsModalOpen(false);
                    setNewMeal({ title: '', description: '', type: 'Meal' });
                    setError(''); // Clear any errors
                  } catch (err) {
                    setModalError(err.message || 'Failed to add meal');
                  } finally {
                    setModalSubmitting(false);
                  }
                }}
                className="w-full px-6 py-2 text-white rounded-lg transition-colors disabled:opacity-60"
                style={{backgroundColor: 'var(--primary-color)'}}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'var(--primary-hover)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'var(--primary-color)';
                }}
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


