import React, { useEffect, useMemo, useState } from 'react';
import { mealService, restaurantService } from '../../../services/restaurantService';

const WeeklyMenu = () => {
  const [selectedDay, setSelectedDay] = useState('sun');
  const [availableMenu1, setAvailableMenu1] = useState([]); // Menu 1 meals
  const [availableMenu2, setAvailableMenu2] = useState([]); // Menu 2 meals
  const [availableSoups, setAvailableSoups] = useState([]); // type "Soup"
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');
  const [newMeal, setNewMeal] = useState({ name_de: '', name_en: '', description: '', type: 'Meal', menuCategory: 'menu_1' });

  // Per-day selections: menu_1, menu_2, and soup
  const initialSelections = useMemo(() => ({
    sat: { menu_1: '', menu_2: '', soup: '' },
    sun: { menu_1: '', menu_2: '', soup: '' },
    mon: { menu_1: '', menu_2: '', soup: '' },
    tue: { menu_1: '', menu_2: '', soup: '' },
    wed: { menu_1: '', menu_2: '', soup: '' },
    thu: { menu_1: '', menu_2: '', soup: '' },
    fri: { menu_1: '', menu_2: '', soup: '' },
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

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError('');
      try {
        const [menu1Meals, menu2Meals, soups, weeklyMenuData] = await Promise.all([
          mealService.listMeals({ type: 'Meal', menuCategory: 'menu_1' }),
          mealService.listMeals({ type: 'Meal', menuCategory: 'menu_2' }),
          mealService.listMeals({ type: 'Soup' }),
          restaurantService.getWeeklyMenu(),
        ]);
        setAvailableMenu1(menu1Meals);
        setAvailableMenu2(menu2Meals);
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
              const menu1Id = dayMenu.menu_1?.[0]?._id || dayMenu.menu_1?.[0]?.id || '';
              const menu2Id = dayMenu.menu_2?.[0]?._id || dayMenu.menu_2?.[0]?.id || '';
              const soupId = dayMenu.soups?.[0]?._id || dayMenu.soups?.[0]?.id || '';
              loadedSelections[dayKey] = {
                menu_1: menu1Id,
                menu_2: menu2Id,
                soup: soupId,
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

  const idToMeal = useMemo(() => new Map([...availableMenu1, ...availableMenu2, ...availableSoups].map(m => [m._id || m.id, m])), [availableMenu1, availableMenu2, availableSoups]);

  const resolvedMenu = useMemo(() => {
    const result = {};
    for (const d of days) {
      const sel = weekSelections[d.key];
      const entries = [
        { id: sel.menu_1, label: 'Menu 1' },
        { id: sel.menu_2, label: 'Menu 2' },
        { id: sel.soup, label: 'Soup' }
      ]
        .filter(e => e.id)
        .map(e => ({ ...e, meal: idToMeal.get(e.id) }))
        .filter(e => e.meal)
        .map(e => ({ 
          name: e.meal.name_en || e.meal.name_de || e.meal.title || e.meal.name, 
          description: e.meal.description || '',
          label: e.label
        }));
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

        {/* Selection dropdowns for each category */}
        <div className="space-y-5 mb-6">
          {/* Menu 1 Selection */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <label className="flex items-center text-sm font-semibold text-gray-800">
                <span className="inline-block w-2 h-2 rounded-full mr-2" style={{backgroundColor: 'var(--primary-color)'}}></span>
                Menu 1 Meal
              </label>
              <button
                onClick={() => {
                  setNewMeal({ name_de: '', name_en: '', description: '', type: 'Meal', menuCategory: 'menu_1' });
                  setIsModalOpen(true);
                }}
                className="px-3 py-1.5 text-xs font-medium text-white rounded-md transition-all hover:shadow-sm flex items-center gap-1"
                style={{backgroundColor: 'var(--primary-color)'}}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--primary-hover)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--primary-color)'}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Meal
              </button>
            </div>
            <select
              value={weekSelections[selectedDay].menu_1 || ''}
              onChange={async (e) => {
                const mealId = e.target.value;
                updateSelection('menu_1', mealId);
                
                // Update backend
                if (mealId) {
                  try {
                    const currentDay = days.find(d => d.key === selectedDay);
                    const dayName = currentDay?.fullName;
                    await restaurantService.addMealToDay(dayName, mealId, 'menu_1');
                  } catch (err) {
                    console.error('Failed to update menu 1:', err);
                    setError(err.message || 'Failed to update menu 1');
                    updateSelection('menu_1', '');
                  }
                } else {
                  // Remove if empty
                  try {
                    const currentDay = days.find(d => d.key === selectedDay);
                    const dayName = currentDay?.fullName;
                    const currentId = weekSelections[selectedDay].menu_1;
                    if (currentId) {
                      await restaurantService.removeMealFromDay(dayName, currentId, 'menu_1');
                    }
                  } catch (err) {
                    console.error('Failed to remove menu 1:', err);
                  }
                }
              }}
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 bg-white text-gray-900 font-medium shadow-sm hover:border-gray-400 transition-colors"
              style={{'--tw-ring-color': 'var(--primary-color)'}}
            >
              <option value="">Select Menu 1 Meal...</option>
              {availableMenu1.map(meal => (
                <option key={meal._id || meal.id} value={meal._id || meal.id}>
                  {meal.name_en || meal.name_de || meal.title || meal.name}
                </option>
              ))}
            </select>
          </div>

          {/* Menu 2 Selection */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <label className="flex items-center text-sm font-semibold text-gray-800">
                <span className="inline-block w-2 h-2 rounded-full mr-2" style={{backgroundColor: 'var(--primary-color)'}}></span>
                Menu 2 Meal
              </label>
              <button
                onClick={() => {
                  setNewMeal({ name_de: '', name_en: '', description: '', type: 'Meal', menuCategory: 'menu_2' });
                  setIsModalOpen(true);
                }}
                className="px-3 py-1.5 text-xs font-medium text-white rounded-md transition-all hover:shadow-sm flex items-center gap-1"
                style={{backgroundColor: 'var(--primary-color)'}}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--primary-hover)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--primary-color)'}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Meal
              </button>
            </div>
            <select
              value={weekSelections[selectedDay].menu_2 || ''}
              onChange={async (e) => {
                const mealId = e.target.value;
                updateSelection('menu_2', mealId);
                
                // Update backend
                if (mealId) {
                  try {
                    const currentDay = days.find(d => d.key === selectedDay);
                    const dayName = currentDay?.fullName;
                    await restaurantService.addMealToDay(dayName, mealId, 'menu_2');
                  } catch (err) {
                    console.error('Failed to update menu 2:', err);
                    setError(err.message || 'Failed to update menu 2');
                    updateSelection('menu_2', '');
                  }
                } else {
                  // Remove if empty
                  try {
                    const currentDay = days.find(d => d.key === selectedDay);
                    const dayName = currentDay?.fullName;
                    const currentId = weekSelections[selectedDay].menu_2;
                    if (currentId) {
                      await restaurantService.removeMealFromDay(dayName, currentId, 'menu_2');
                    }
                  } catch (err) {
                    console.error('Failed to remove menu 2:', err);
                  }
                }
              }}
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 bg-white text-gray-900 font-medium shadow-sm hover:border-gray-400 transition-colors"
              style={{'--tw-ring-color': 'var(--primary-color)'}}
            >
              <option value="">Select Menu 2 Meal...</option>
              {availableMenu2.map(meal => (
                <option key={meal._id || meal.id} value={meal._id || meal.id}>
                  {meal.name_en || meal.name_de || meal.title || meal.name}
                </option>
              ))}
            </select>
          </div>

          {/* Soup Selection */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <label className="flex items-center text-sm font-semibold text-gray-800">
                <span className="inline-block w-2 h-2 rounded-full mr-2" style={{backgroundColor: 'var(--primary-color)'}}></span>
                Soup
              </label>
              <button
                onClick={() => {
                  setNewMeal({ name_de: '', name_en: '', description: '', type: 'Soup', menuCategory: null });
                  setIsModalOpen(true);
                }}
                className="px-3 py-1.5 text-xs font-medium text-white rounded-md transition-all hover:shadow-sm flex items-center gap-1"
                style={{backgroundColor: 'var(--primary-color)'}}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--primary-hover)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--primary-color)'}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Soup
              </button>
            </div>
            <select
              value={weekSelections[selectedDay].soup || ''}
              onChange={async (e) => {
                const soupId = e.target.value;
                updateSelection('soup', soupId);
                
                // Update backend
                if (soupId) {
                  try {
                    const currentDay = days.find(d => d.key === selectedDay);
                    const dayName = currentDay?.fullName;
                    await restaurantService.addMealToDay(dayName, soupId, 'soups');
                  } catch (err) {
                    console.error('Failed to update soup:', err);
                    setError(err.message || 'Failed to update soup');
                    updateSelection('soup', '');
                  }
                } else {
                  // Remove if empty
                  try {
                    const currentDay = days.find(d => d.key === selectedDay);
                    const dayName = currentDay?.fullName;
                    const currentId = weekSelections[selectedDay].soup;
                    if (currentId) {
                      await restaurantService.removeMealFromDay(dayName, currentId, 'soups');
                    }
                  } catch (err) {
                    console.error('Failed to remove soup:', err);
                  }
                }
              }}
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 bg-white text-gray-900 font-medium shadow-sm hover:border-gray-400 transition-colors"
              style={{'--tw-ring-color': 'var(--primary-color)'}}
            >
              <option value="">Select Soup...</option>
              {availableSoups.map(soup => (
                <option key={soup._id || soup.id} value={soup._id || soup.id}>
                  {soup.name_en || soup.name_de || soup.title || soup.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected items display */}
        {weekSelections[selectedDay].menu_1 || weekSelections[selectedDay].menu_2 || weekSelections[selectedDay].soup ? (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Selected Items for {days.find(d => d.key === selectedDay)?.label}
            </h3>
            <div className="space-y-2.5">
              {['menu_1', 'menu_2', 'soup'].map((slot) => {
                const id = weekSelections[selectedDay][slot];
                if (!id) return null;
                const item = idToMeal.get(id);
                if (!item) return null;
                const label = slot === 'soup' ? 'Soup' : (slot === 'menu_1' ? 'Menu 1' : 'Menu 2');
                return (
                  <div key={slot} className="flex items-center justify-between py-3 px-4 bg-white border-2 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="px-2.5 py-1 rounded-md text-xs font-semibold border bg-gray-100 text-gray-700 border-gray-200">
                        {label}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 text-base mb-1">
                          {item.name_en || item.name_de || item.title || item.name}
                        </div>
                        {item.description && (
                          <div className="text-sm text-gray-500 line-clamp-2">{item.description}</div>
                        )}
                      </div>
                    </div>
                    <button 
                      onClick={async () => {
                        try {
                          const currentDay = days.find(d => d.key === selectedDay);
                          const dayName = currentDay?.fullName;
                          await restaurantService.removeMealFromDay(dayName, id, slot === 'soup' ? 'soups' : slot);
                          updateSelection(slot, '');
                        } catch (err) {
                          console.error('Failed to remove:', err);
                          setError(err.message || 'Failed to remove');
                        }
                      }} 
                      className="ml-4 px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                    >
                      Remove
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="mb-6 text-center py-8 text-gray-400 text-sm bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            No items selected for this day. Use the dropdowns above to make selections.
          </div>
        )}
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
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-purple-300 uppercase">{meal.label}</span>
                      </div>
                      <div className="font-medium text-white">{meal.name}</div>
                      {meal.description && (
                      <div className="text-gray-300">{meal.description}</div>
                      )}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">German Name (name_de)</label>
                <input
                  type="text"
                  value={newMeal.name_de}
                  onChange={(e) => setNewMeal({ ...newMeal, name_de: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                  style={{'--tw-ring-color': 'var(--primary-color)'}}
                  placeholder="German name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">English Name (name_en)</label>
                <input
                  type="text"
                  value={newMeal.name_en}
                  onChange={(e) => setNewMeal({ ...newMeal, name_en: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                  style={{'--tw-ring-color': 'var(--primary-color)'}}
                  placeholder="English name"
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
                  placeholder="Describe the meal (optional)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={newMeal.type}
                  onChange={(e) => setNewMeal({ ...newMeal, type: e.target.value, menuCategory: e.target.value === 'Soup' ? null : newMeal.menuCategory })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                  style={{'--tw-ring-color': 'var(--primary-color)'}}
                >
                  <option value="Meal">Meal</option>
                  <option value="Soup">Soup</option>
                </select>
              </div>
              {newMeal.type === 'Meal' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Menu Category</label>
                  <select
                    value={newMeal.menuCategory || 'menu_1'}
                    onChange={(e) => setNewMeal({ ...newMeal, menuCategory: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                    style={{'--tw-ring-color': 'var(--primary-color)'}}
                  >
                    <option value="menu_1">Menu 1</option>
                    <option value="menu_2">Menu 2</option>
                  </select>
                </div>
              )}
            </div>

            <div className="flex gap-4 w-full mt-6">
              <button
                onClick={() => { setIsModalOpen(false); setModalError(''); setNewMeal({ name_de: '', name_en: '', description: '', type: 'Meal', menuCategory: 'menu_1' }); }}
                className="w-full px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={modalSubmitting || !(newMeal.name_de?.trim() && newMeal.name_en?.trim())}
                onClick={async () => {
                  if (!newMeal.name_de?.trim() || !newMeal.name_en?.trim()) {
                    setModalError('Please enter both German and English names');
                    return;
                  }
                  setModalSubmitting(true);
                  setModalError('');
                  try {
                    const mealData = {
                      name_de: newMeal.name_de,
                      name_en: newMeal.name_en,
                      description: newMeal.description,
                      type: newMeal.type,
                      isRecommended: false,
                    };
                    if (newMeal.menuCategory) {
                      mealData.menuCategory = newMeal.menuCategory;
                    }
                    
                    const created = await mealService.createMeal(mealData);
                    
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
                      // Add to the appropriate menu list
                      if (created.menuCategory === 'menu_1') {
                        setAvailableMenu1(prev => [created, ...prev]);
                        await restaurantService.addMealToDay(dayName, created._id || created.id, 'menu_1');
                        setWeekSelections(prev => ({
                          ...prev,
                          [selectedDay]: { 
                            ...prev[selectedDay], 
                            menu_1: prev[selectedDay].menu_1 || (created._id || created.id) 
                          },
                        }));
                      } else if (created.menuCategory === 'menu_2') {
                        setAvailableMenu2(prev => [created, ...prev]);
                        await restaurantService.addMealToDay(dayName, created._id || created.id, 'menu_2');
                        setWeekSelections(prev => ({
                            ...prev, 
                            [selectedDay]: { 
                            ...prev[selectedDay], 
                            menu_2: prev[selectedDay].menu_2 || (created._id || created.id) 
                          },
                        }));
                      }
                    }
                    
                    setIsModalOpen(false);
                    setNewMeal({ name_de: '', name_en: '', description: '', type: 'Meal', menuCategory: 'menu_1' });
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


