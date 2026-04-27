import React, { useState, useEffect } from "react";
import axios from "axios"; // npm install axios 필요
import { 
  LayoutDashboard, Receipt, Wallet, Plus, Bell, 
  Moon, Sun, ChevronRight, X, Users
} from "lucide-react";
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, Cell 
} from 'recharts';

export default function App() {
  // 1. 상태 관리 (가짜 데이터 대신 서버 데이터를 담을 공간)
  const [isDarkMode, setIsDarkMode] = useState(false); 
  const [activeTab, setActiveTab] = useState("DASHBOARD");
  const [expenseModal, setExpenseModal] = useState(false);
  
  const [dashboardData, setDashboardData] = useState(null); // DB 데이터 저장소
  const [loading, setLoading] = useState(true);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // 2. 백엔드(DashboardService.java) 데이터 호출
  // 2. 백엔드(DashboardService.java) 데이터 호출
  // 2. 백엔드(DashboardService.java) 데이터 호출
  useEffect(() => {
    const houseId = "h1-0000-0000-0000-000000000001"; 
    const userId = "u1-0000-0000-0000-000000000001";

    axios.get(`https://n-b-bang-backend.vercel.app/api/v1/houses/${houseId}/dashboard`, {
      params: { userId: userId }
    })
    .then(res => {
      // 수정 전: setDashboardData(res.data.data);
      // 수정 후: 백엔드가 보내준 몸통(res.data)을 바로 저장합니다.
      setDashboardData(res.data); 
      setLoading(false);
    })
    .catch(err => {
      console.error("데이터 로드 실패:", err);
      setLoading(false);
    });
  }, []);
  if (loading) return <div style={{ color: 'var(--text)', padding: '20px' }}>연결 중...</div>;
  if (!dashboardData) return <div style={{ color: 'var(--text)', padding: '20px' }}>서버 전원을 확인해주세요.</div>;

  return (
    <div className={isDarkMode ? "dark-theme" : "light-theme"}>
      <style>{`
        :root {
          --bg: #FFFFFF; --card: #F8F9FA; --text: #FCD34D; --text-sub: #6B7280;
          --primary: #F59E0B; --chart-inactive: #FCD34D; --border: #E5E7EB;
          --modal-bg: rgba(0, 0, 0, 0.4);
        }
        .dark-theme {
          --bg: #000000 !important; --card: #121212; --text: #FFFFFF;
          --text-sub: #A1A1AA; --primary: #FFD700; --chart-inactive: #27272A;
          --border: #262626; --modal-bg: rgba(0, 0, 0, 0.8);
        }
        * { box-sizing: border-box; transition: background 0.3s ease, color 0.2s ease; }
        html, body { background-color: var(--bg); margin: 0; padding: 0; min-height: 100vh; }
        body { font-family: 'Pretendard', sans-serif; color: var(--text); }
        .full-bg { background-color: var(--bg); min-height: 100vh; }
        .container { max-width: 480px; margin: 0 auto; padding: 0 20px 140px; }
        .card { background: var(--card); border-radius: 24px; padding: 20px; border: 1px solid var(--border); }
        .btn-icon { 
          border: none; background: var(--card); color: var(--text); 
          padding: 12px; border-radius: 16px; cursor: pointer; border: 1px solid var(--border); 
          display: flex; align-items: center; justify-content: center;
        }
      `}</style>

      <div className="full-bg">
        <div className="container">
          <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "40px 0 20px" }}>
            <div>
              <span style={{ fontSize: "12px", color: "var(--primary)", fontWeight: "700" }}>NBANG PREMIUM</span>
              <h1 style={{ fontSize: "26px", fontWeight: "900", margin: "2px 0 0" }}>대시보드</h1>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={toggleTheme} className="btn-icon">
                {isDarkMode ? <Sun size={20} color="var(--primary)" /> : <Moon size={20} color="var(--primary)" />}
              </button>
            </div>
          </header>

          <main style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {activeTab === "DASHBOARD" && <DashboardView data={dashboardData} />}
            {/* 다른 탭은 생략하거나 비슷한 방식으로 연동 */}
            {activeTab !== "DASHBOARD" && <div className="card" style={{textAlign:'center', padding:'60px'}}>준비 중...</div>}
          </main>
        </div>

        {/* Floating Nav */}
        <nav style={{
          position: "fixed", bottom: "30px", left: "50%", transform: "translateX(-50%)",
          width: "calc(100% - 40px)", maxWidth: "400px", background: "var(--card)",
          padding: "18px 28px", display: "flex", justifyContent: "space-between", alignItems: "center",
          borderRadius: "32px", border: "1px solid var(--border)", zIndex: 100,
          boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
        }}>
          <TabItem icon={LayoutDashboard} label="홈" active={activeTab === "DASHBOARD"} onClick={() => setActiveTab("DASHBOARD")} />
          <TabItem icon={Receipt} label="내역" active={activeTab === "EXPENSES"} onClick={() => setActiveTab("EXPENSES")} />
          <button onClick={() => setExpenseModal(true)} style={{
            width: "60px", height: "60px", borderRadius: "50%", background: "var(--primary)",
            border: "none", marginTop: "-45px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
          }}>
            <Plus size={36} strokeWidth={3} />
          </button>
          <TabItem icon={Wallet} label="정산" active={activeTab === "SETTLEMENT"} onClick={() => setActiveTab("SETTLEMENT")} />
          <TabItem icon={Users} label="멤버" active={activeTab === "MEMBERS"} onClick={() => setActiveTab("MEMBERS")} />
        </nav>
      </div>

      {expenseModal && <AddExpenseModal onClose={() => setExpenseModal(false)} />}
    </div>
  );
}

function TabItem({ icon: Icon, label, active, onClick }) {
  return (
    <div onClick={onClick} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "5px", color: active ? "var(--primary)" : "var(--text-sub)", cursor: "pointer" }}>
      <Icon size={24} strokeWidth={active ? 2.5 : 2} />
      <span style={{ fontSize: "11px", fontWeight: active ? "800" : "500" }}>{label}</span>
    </div>
  );
}

// ─── DashboardView: 진짜 데이터를 받아서 보여줌 ───
function DashboardView({ data }) {
  return (
    <>
      <div className="card" style={{ border: "none", background: "linear-gradient(135deg, var(--card) 0%, var(--bg) 100%)" }}>
        <p style={{ margin: "0 0 6px", fontSize: "14px", color: "var(--text-sub)" }}>이번 달 총 지출</p>
        <h2 style={{ fontSize: "38px", fontWeight: "900", margin: 0, color: "var(--primary)" }}>
          ₩{data.summary.totalExpense.toLocaleString()}
        </h2>
        
        <div style={{ display: "flex", gap: "12px", marginTop: "30px" }}>
          <div style={{ flex: 1, padding: "12px", borderRadius: "16px", background: "rgba(128,128,128,0.08)", border: "1px solid var(--border)" }}>
            <span style={{ fontSize: "12px", color: "var(--text-sub)" }}>내 분담금</span>
            <div style={{ fontWeight: "700", fontSize: "16px" }}>₩{data.summary.myShare.toLocaleString()}</div>
          </div>
          <div style={{ flex: 1, padding: "12px", borderRadius: "16px", background: "rgba(128,128,128,0.08)", border: "1px solid var(--border)" }}>
            <span style={{ fontSize: "12px", color: "var(--text-sub)" }}>미정산(받을돈)</span>
            <div style={{ fontWeight: "700", fontSize: "16px", color: "#FF5252" }}>₩{data.summary.unsettledReceivable.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontSize: "16px", fontWeight: "700", margin: "0 0 20px" }}>월별 지출 추이</h3>
        <div style={{ width: "100%", height: 160 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.monthlyStats}>
              <Bar dataKey="amount" radius={[6, 6, 6, 6]}>
                {data.monthlyStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === data.monthlyStats.length - 1 ? 'var(--primary)' : 'var(--chart-inactive)'} />
                ))}
              </Bar>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: 'var(--text-sub)'}} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <section>
<div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
  {/* data.recentExpenses가 null인지 먼저 확인하는 코드를 넣습니다. */}
  {data.recentExpenses && data.recentExpenses.length > 0 ? (
    data.recentExpenses.map(item => (
      <div key={item.expenseId} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px" }}>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <div style={{ width: 48, height: 48, borderRadius: "16px", background: "var(--bg)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>
            {item.category === 'HOUSEHOLD' ? '🏠' : '🛒'}
          </div>
          <div>
            <div style={{ fontWeight: "700", fontSize: "15px" }}>{item.title}</div>
            <div style={{ fontSize: "12px", color: "var(--text-sub)" }}>{item.expenseDate}</div>
          </div>
        </div>
        <div style={{ fontWeight: "900", fontSize: "16px" }}>₩{item.amount.toLocaleString()}</div>
      </div>
    ))
  ) : (
    // 데이터가 없을 때 보여줄 문구
    <div className="card" style={{textAlign:'center', color:'var(--text-sub)', padding: '20px'}}>
      최근 지출 내역이 없습니다.
    </div>
  )}
</div>
      </section>
    </>
  );
}

function AddExpenseModal({ onClose }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");

  const handleSave = async () => {
    if (!title || !amount) return alert("내용을 입력하세요");

    try {
      const houseId = "h1-0000-0000-0000-000000000001";
      // 백엔드로 실제 전송
      await axios.post(`https://n-b-bang-backend.vercel.app/api/v1/houses/${houseId}/expenses`, {
        title: title,
        amount: Number(amount),
        userId: "u1-0000-0000-0000-000000000001"
      });

      onClose(); // 성공 시 창 닫기
      window.location.reload(); // 화면 갱신해서 바뀐 데이터 가져오기
    } catch (err) {
      alert("전송 실패");
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "var(--modal-bg)", zIndex: 1000, display: "flex", alignItems: "flex-end" }}>
      <div style={{ width: "100%", maxWidth: "480px", margin: "0 auto", background: "var(--card)", borderRadius: "32px 32px 0 0", padding: "32px" }}>
        <h3 style={{ fontSize: "22px", fontWeight: "800", marginBottom: "20px" }}>새 지출</h3>
        <input 
          placeholder="항목 (예: 치킨)" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", padding: "18px", borderRadius: "16px", border: "1px solid var(--border)", marginBottom: "12px" }} 
        />
        <input 
          type="number"
          placeholder="금액 (예: 20000)" 
          value={amount} 
          onChange={(e) => setAmount(e.target.value)}
          style={{ width: "100%", padding: "18px", borderRadius: "16px", border: "1px solid var(--border)" }} 
        />
        <button onClick={handleSave} style={{ width: "100%", padding: "20px", borderRadius: "20px", background: "var(--primary)", border: "none", fontWeight: "900", marginTop: "24px", cursor: 'pointer' }}>
          저장하기
        </button>
        <button onClick={onClose} style={{ width: "100%", background: "none", border: "none", marginTop: "10px", color: "var(--text-sub)", cursor: "pointer" }}>취소</button>
      </div>
    </div>
  );
}