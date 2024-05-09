import React, { useState } from 'react';
import PortfolioList from '../AdminComponents/PortfolioList';
import LifeList from '../AdminComponents/LifeList';
import SkillList from '../AdminComponents/SkillList';



const AdminPage = () => {
  const [mode, setMode] = useState<'portfolio' | 'life'>('portfolio');

  return (
    <div>
      <h1>Admin Panel</h1>
      <div>
        <button onClick={() => setMode('portfolio')}>Portfolio Mode</button>
        <button onClick={() => setMode('life')}>Life Mode</button>
      </div>

      {mode === 'portfolio' ? (
        <PortfolioList />
      ) : (
        <LifeList />
      )}
<SkillList/>
    </div>
  );
};

export default AdminPage;
