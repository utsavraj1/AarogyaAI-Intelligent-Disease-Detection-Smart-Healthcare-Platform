"""
frontend/app.py — AarogyaAI v2.2 Full Production Frontend
=======================================================
Pages:
  🔐 Login / Register
  🏠 Dashboard
  🧬 Run Diagnosis (6 modules)
  🗄  Health Locker (records + file uploads)
  📋 My Predictions (history + PDF download)
  👨‍⚕️ Find a Doctor
  ℹ️  About

Run: streamlit run frontend/app.py
API must be running: uvicorn backend.main:app --port 8000
"""

import base64
import json
import time
from datetime import datetime
from io import BytesIO
from pathlib import Path

import requests
import streamlit as st

# ── Config ────────────────────────────────────────────────────────────────────
API_BASE = "http://localhost:8000"
BACKGROUND_IMAGE_URL = (
    "https://www.strategyand.pwc.com/m1/en/strategic-foresight/sector-strategies"
    "/healthcare/ai-powered-healthcare-solutions/img01-section1.jpg"
)

st.set_page_config(
    page_title="AarogyaAI — Diagnosis System",
    page_icon="🧬",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ── Session defaults ──────────────────────────────────────────────────────────
for key, default in {
    "token": None, "user": None,
    "page": "login", "pred_log": [],
}.items():
    if key not in st.session_state:
        st.session_state[key] = default


# ═══════════════════════════════════════════════════════════════════════════════
#  STYLES
# ═══════════════════════════════════════════════════════════════════════════════
st.markdown(f"""
<style>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

html, body, [class*="css"] {{ font-family:'Syne',sans-serif; }}
.main .block-container {{ padding:0 2rem 3rem; max-width:1200px; margin:0 auto; position:relative; z-index:1; }}

/* Equal spacing and centered columns */
[data-testid="stHorizontalBlock"] {{ gap:1rem; align-items:stretch; }}
[data-testid="stHorizontalBlock"] > div {{ flex:1 1 0; }}

/* Background */
[data-testid="stAppViewContainer"] {{
    background-image:url({BACKGROUND_IMAGE_URL});
    background-size:cover; background-position:center;
    background-repeat:no-repeat; background-attachment:fixed;
}}
[data-testid="stAppViewContainer"]::before {{
    content:""; position:fixed; inset:0;
    background:linear-gradient(135deg,rgba(4,10,20,0.93),rgba(5,14,28,0.89),rgba(3,14,10,0.91));
    z-index:0; pointer-events:none;
}}

/* Sidebar */
[data-testid="stSidebar"] {{
    background:rgba(4,10,20,0.90)!important;
    backdrop-filter:blur(20px) saturate(150%);
    border-right:1px solid rgba(29,158,117,0.18)!important;
    min-width:260px!important; max-width:260px!important;
}}
[data-testid="stSidebar"] * {{ color:#8ba3be!important; }}
[data-testid="stSidebar"] .stRadio label {{
    display:flex; align-items:center; gap:10px; padding:9px 16px;
    border-radius:8px; cursor:pointer; font-size:0.84rem; font-weight:500;
    transition:all 0.18s; border:1px solid transparent;
}}
[data-testid="stSidebar"] .stRadio label:hover {{
    background:rgba(29,158,117,0.10); border-color:rgba(29,158,117,0.20);
    color:#c8dff0!important;
}}

/* Top bar */
.topbar {{
    background:rgba(4,10,20,0.82); backdrop-filter:blur(18px);
    border-bottom:1px solid rgba(29,158,117,0.20);
    padding:13px 32px; display:flex; align-items:center;
    justify-content:space-between;
    margin:0 -2rem 2rem; position:sticky; top:0; z-index:200;
}}
.tb-brand {{ display:flex; align-items:center; gap:12px; }}
.tb-logo {{
    width:34px; height:34px;
    background:linear-gradient(135deg,#1d9e75,#0f6e56);
    border-radius:9px; display:flex; align-items:center;
    justify-content:center; font-size:17px;
    box-shadow:0 0 14px rgba(29,158,117,0.4);
}}
.tb-name {{ font-size:1.05rem; font-weight:800; color:#e8f4ee; }}
.tb-badge {{
    font-family:'JetBrains Mono',monospace; font-size:0.62rem;
    color:#1d9e75; background:rgba(29,158,117,0.10);
    border:1px solid rgba(29,158,117,0.30); padding:2px 8px; border-radius:4px;
}}
.tb-right {{ display:flex; align-items:center; gap:16px; }}
.tb-user {{
    font-size:0.78rem; color:#4a8070;
    background:rgba(29,158,117,0.08);
    border:1px solid rgba(29,158,117,0.18);
    padding:4px 12px; border-radius:6px;
}}
.status-dot {{
    width:8px; height:8px; border-radius:50%; background:#1d9e75;
    box-shadow:0 0 8px rgba(29,158,117,0.6); animation:pulse 2s infinite;
}}
@keyframes pulse {{ 0%,100%{{opacity:1}} 50%{{opacity:0.4}} }}

/* Glass card */
.g-card {{
    background:rgba(6,14,28,0.68); backdrop-filter:blur(22px) saturate(150%);
    border:1px solid rgba(255,255,255,0.07); border-radius:16px;
    padding:28px 32px; margin-bottom:20px;
    box-shadow:0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04);
}}
.g-card-sm {{
    background:rgba(6,14,28,0.60); backdrop-filter:blur(16px);
    border:1px solid rgba(255,255,255,0.06); border-radius:12px;
    padding:18px 22px;
    box-shadow:0 4px 20px rgba(0,0,0,0.30);
}}

/* Hero */
.page-hero {{
    background:linear-gradient(135deg,rgba(5,12,24,0.80),rgba(8,25,41,0.75),rgba(5,25,17,0.78));
    backdrop-filter:blur(24px); border:1px solid rgba(29,158,117,0.22);
    border-radius:18px; padding:40px 50px; margin-bottom:28px;
    position:relative; overflow:hidden;
}}
.page-hero::after {{
    content:''; position:absolute; right:-60px; top:-60px;
    width:280px; height:280px;
    background:radial-gradient(circle,rgba(29,158,117,0.10),transparent 65%);
    border-radius:50%; pointer-events:none;
}}
.hero-eye {{
    font-family:'JetBrains Mono',monospace; font-size:0.68rem;
    letter-spacing:2.5px; color:#1d9e75; text-transform:uppercase;
    margin-bottom:12px; display:flex; align-items:center; gap:8px;
}}
.hero-eye::before {{ content:''; display:inline-block; width:18px; height:1px; background:#1d9e75; }}
.hero-h {{ font-size:2.2rem; font-weight:800; color:#f0f8ff; margin:0 0 10px; letter-spacing:-1px; }}
.hero-s {{ color:#6a98b8; font-size:0.94rem; max-width:560px; line-height:1.65; margin:0; }}

/* Section label */
.s-lbl {{
    font-size:0.68rem; font-weight:600; color:#2a5570; letter-spacing:2px;
    text-transform:uppercase; margin:0 0 14px;
    display:flex; align-items:center; gap:8px;
}}
.s-lbl::after {{ content:''; flex:1; height:1px; background:rgba(255,255,255,0.06); }}

/* Stat grid */
.stat-grid {{ display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:24px; }}
.stat-card {{
    background:rgba(6,14,28,0.65); backdrop-filter:blur(16px);
    border:1px solid rgba(255,255,255,0.07); border-radius:14px;
    padding:20px 24px; position:relative; overflow:hidden;
    transition:border-color 0.2s, transform 0.2s;
}}
.stat-card:hover {{ border-color:rgba(29,158,117,0.30); transform:translateY(-2px); }}
.stat-card::after {{
    content:''; position:absolute; bottom:0; left:0; right:0; height:2px;
    background:linear-gradient(90deg,transparent,#1d9e75,transparent); opacity:0.5;
}}
.stat-v {{ font-size:2rem; font-weight:800; color:#e8f4ff; letter-spacing:-1.5px; line-height:1; }}
.stat-l {{ font-size:0.72rem; color:#3a6080; margin-top:5px; text-transform:uppercase; letter-spacing:0.6px; }}
.stat-d {{ font-size:0.70rem; color:#1d9e75; margin-top:8px; font-family:'JetBrains Mono',monospace; }}

/* Result cards */
.r-pos {{
    background:rgba(21,8,8,0.82); backdrop-filter:blur(14px);
    border:1.5px solid rgba(163,45,45,0.65); border-radius:14px;
    padding:24px; margin-bottom:18px;
    box-shadow:0 4px 24px rgba(163,45,45,0.18);
}}
.r-neg {{
    background:rgba(4,18,12,0.82); backdrop-filter:blur(14px);
    border:1.5px solid rgba(29,158,117,0.55); border-radius:14px;
    padding:24px; margin-bottom:18px;
    box-shadow:0 4px 24px rgba(29,158,117,0.14);
}}
.r-lbl-pos {{ font-size:0.68rem; color:#e24b4a; letter-spacing:2px; text-transform:uppercase; font-family:'JetBrains Mono',monospace; margin-bottom:8px; }}
.r-lbl-neg {{ font-size:0.68rem; color:#1d9e75; letter-spacing:2px; text-transform:uppercase; font-family:'JetBrains Mono',monospace; margin-bottom:8px; }}
.r-title {{ font-size:1.4rem; font-weight:800; margin:0 0 5px; letter-spacing:-0.5px; }}
.r-title-pos {{ color:#f06060; }}
.r-title-neg {{ color:#3dd8a0; }}
.r-sub {{ font-size:0.82rem; color:#4a7090; }}
.r-disc {{ font-size:0.76rem; color:#2a4060; margin-top:14px; padding-top:12px; border-top:1px solid rgba(255,255,255,0.05); line-height:1.6; }}

/* Confidence bar */
.conf-row {{ margin-bottom:14px; }}
.conf-hdr {{ display:flex; justify-content:space-between; margin-bottom:5px; }}
.conf-name {{ font-size:0.79rem; color:#7a9ab8; }}
.conf-pct {{ font-size:0.79rem; font-family:'JetBrains Mono',monospace; color:#c8dff0; }}
.conf-track {{ height:5px; background:rgba(255,255,255,0.07); border-radius:3px; overflow:hidden; }}

/* Meta strip */
.meta-strip {{
    display:flex; gap:18px; flex-wrap:wrap;
    font-family:'JetBrains Mono',monospace;
    font-size:0.66rem; color:#2a4060; margin-top:14px;
    padding-top:12px; border-top:1px solid rgba(255,255,255,0.05);
}}

/* Buttons */
.stButton>button {{
    background:linear-gradient(135deg,#1d9e75,#0f6e56)!important;
    color:#fff!important; border:none!important; border-radius:11px!important;
    padding:12px 28px!important; font-family:'Syne',sans-serif!important;
    font-weight:700!important; font-size:0.88rem!important;
    width:100%!important; transition:all 0.22s!important;
    box-shadow:0 4px 16px rgba(29,158,117,0.28)!important;
}}
.stButton>button:hover {{
    background:linear-gradient(135deg,#22b888,#1d9e75)!important;
    transform:translateY(-2px)!important;
    box-shadow:0 8px 28px rgba(29,158,117,0.42)!important;
}}

/* Inputs */
.stTextInput input,.stNumberInput input,.stPasswordInput input {{
    background:rgba(8,20,40,0.72)!important;
    border:1px solid rgba(255,255,255,0.09)!important;
    color:#c8dff0!important; border-radius:9px!important;
}}
.stTextInput input:focus,.stNumberInput input:focus {{
    border-color:rgba(29,158,117,0.5)!important;
    box-shadow:0 0 0 3px rgba(29,158,117,0.12)!important;
}}
.stSelectbox>div>div {{ background:rgba(8,20,40,0.72)!important; border-color:rgba(255,255,255,0.09)!important; color:#c8dff0!important; }}
label {{ color:#5a80a0!important; font-size:0.80rem!important; }}
[data-testid="stFileUploader"] {{ border:1.5px dashed rgba(29,158,117,0.28)!important; border-radius:14px!important; background:rgba(6,14,28,0.52)!important; }}

/* Doctor card */
.doc-card {{
    background:rgba(6,14,28,0.65); backdrop-filter:blur(16px);
    border:1px solid rgba(255,255,255,0.07); border-radius:14px;
    padding:20px; margin-bottom:14px; transition:all 0.2s;
}}
.doc-card:hover {{ border-color:rgba(29,158,117,0.30); transform:translateY(-2px); }}
.doc-name {{ font-size:1rem; font-weight:700; color:#d8eaff; margin-bottom:3px; }}
.doc-spec {{ font-size:0.75rem; color:#1d9e75; font-family:'JetBrains Mono',monospace; margin-bottom:8px; }}
.doc-row {{ font-size:0.80rem; color:#4a7090; margin-bottom:4px; }}
.doc-badge {{
    display:inline-block; background:rgba(29,158,117,0.10);
    border:1px solid rgba(29,158,117,0.22); border-radius:5px;
    padding:2px 9px; font-size:0.65rem;
    font-family:'JetBrains Mono',monospace; color:#1d9e75; margin-top:8px;
}}

/* Upload locker row */
.upload-row {{
    display:flex; align-items:center; justify-content:space-between;
    background:rgba(6,14,28,0.55); border:1px solid rgba(255,255,255,0.06);
    border-radius:10px; padding:12px 16px; margin-bottom:10px;
}}
.upload-name {{ font-size:0.84rem; font-weight:600; color:#c8dff0; }}
.upload-meta {{ font-size:0.72rem; color:#3a6080; margin-top:2px; }}

/* Info / warn / error */
.info-b {{ background:rgba(4,20,14,0.68); border-left:3px solid #1d9e75; border-radius:0 8px 8px 0; padding:12px 16px; margin:14px 0; font-size:0.82rem; color:#3a8060; line-height:1.55; backdrop-filter:blur(8px); }}
.warn-b {{ background:rgba(22,16,10,0.68); border-left:3px solid #e9a23b; border-radius:0 8px 8px 0; padding:12px 16px; margin:14px 0; font-size:0.82rem; color:#8a5c20; line-height:1.55; backdrop-filter:blur(8px); }}
.error-b {{ background:rgba(21,8,8,0.68); border-left:3px solid #a32d2d; border-radius:0 8px 8px 0; padding:12px 16px; margin:14px 0; font-size:0.82rem; color:#8a2020; line-height:1.55; backdrop-filter:blur(8px); }}

/* Metric pill */
.m-pill {{
    display:inline-flex; align-items:center; gap:6px;
    background:rgba(8,18,36,0.68); backdrop-filter:blur(8px);
    border:1px solid rgba(255,255,255,0.09); border-radius:8px;
    padding:6px 14px; font-family:'JetBrains Mono',monospace;
    font-size:0.73rem; color:#7a9ab8;
}}
.m-pill span {{ color:#1d9e75; font-weight:600; }}

/* Form section title */
.f-sec {{
    font-size:0.68rem; font-weight:600; color:#2a5570;
    letter-spacing:1.8px; text-transform:uppercase; margin-bottom:14px;
    padding-bottom:9px; border-bottom:1px solid rgba(255,255,255,0.05);
    display:flex; align-items:center; gap:6px;
}}
.f-sec::before {{ content:''; display:inline-block; width:12px; height:2px; background:#1d9e75; border-radius:1px; }}

/* Idle state */
.r-idle {{ text-align:center; padding:60px 24px; color:#2a4060; background:rgba(6,14,28,0.50); border-radius:14px; border:1px solid rgba(255,255,255,0.05); }}
.r-idle-icon {{ font-size:3rem; opacity:0.22; margin-bottom:12px; }}

/* Login page */
.login-wrap {{
    max-width:440px; margin:60px auto 0;
    background:rgba(5,12,24,0.82); backdrop-filter:blur(26px);
    border:1px solid rgba(29,158,117,0.22); border-radius:20px;
    padding:44px 48px;
    box-shadow:0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05);
}}
.login-logo {{
    text-align:center; margin-bottom:28px;
}}
.login-logo-icon {{
    width:52px; height:52px; background:linear-gradient(135deg,#1d9e75,#0f6e56);
    border-radius:14px; display:inline-flex; align-items:center; justify-content:center;
    font-size:26px; margin-bottom:12px;
    box-shadow:0 0 24px rgba(29,158,117,0.5);
}}
.login-title {{ font-size:1.5rem; font-weight:800; color:#e8f4ff; margin:0; letter-spacing:-0.5px; }}
.login-sub {{ font-size:0.82rem; color:#4a8090; margin-top:5px; }}

/* Tabs */
.stTabs [data-baseweb="tab-list"] {{ background:rgba(6,14,28,0.65); backdrop-filter:blur(12px); border-bottom:1px solid rgba(255,255,255,0.06); border-radius:10px 10px 0 0; gap:0; }}
.stTabs [data-baseweb="tab"] {{ background:transparent!important; color:#3a6080!important; font-family:'Syne',sans-serif!important; font-size:0.81rem!important; padding:10px 22px!important; border-radius:0!important; transition:color 0.18s!important; }}
.stTabs [aria-selected="true"] {{ color:#1d9e75!important; border-bottom:2px solid #1d9e75!important; }}

/* Scrollbar */
::-webkit-scrollbar{{ width:5px; height:5px; }}
::-webkit-scrollbar-track{{ background:rgba(0,0,0,0.1); }}
::-webkit-scrollbar-thumb{{ background:rgba(29,158,117,0.35); border-radius:3px; }}

/* Responsive layout */
@media (max-width: 1200px) {{
    .main .block-container {{ padding:0 1.2rem 2.4rem; }}
    .stat-grid {{ grid-template-columns:repeat(2,1fr); }}
    .page-hero {{ padding:28px 28px; }}
}}
@media (max-width: 900px) {{
    .topbar {{ flex-direction:column; align-items:flex-start; gap:10px; padding:12px 18px; }}
    .tb-right {{ width:100%; justify-content:space-between; }}
    .stat-grid {{ grid-template-columns:1fr; }}
    [data-testid="stHorizontalBlock"] {{ flex-wrap:wrap; }}
    [data-testid="stHorizontalBlock"] > div {{ flex:1 1 320px; min-width:260px; }}
}}
@media (max-width: 768px) {{
    [data-testid="stSidebar"] {{ min-width:220px!important; max-width:220px!important; }}
    .main .block-container {{ padding:0 1rem 2rem; }}
    .page-hero {{ padding:22px 20px; }}
    .hero-h {{ font-size:1.6rem; }}
    .g-card {{ padding:20px 22px; }}
    .login-wrap {{ margin:30px auto 0; padding:32px 28px; }}
    .stButton>button {{ padding:10px 18px!important; }}
}}
@media (max-width: 520px) {{
    .topbar {{ margin:0 -1rem 1.2rem; }}
    .tb-brand {{ flex-wrap:wrap; }}
    .tb-badge {{ margin-left:0; }}
    [data-testid="stHorizontalBlock"] > div {{ flex:1 1 100%; min-width:0; }}
    [data-testid="stSidebar"] {{ min-width:0!important; max-width:0!important; width:0!important; }}
    [data-testid="stSidebar"] * {{ visibility:hidden; }}
}}

/* Hide chrome */
#MainMenu,footer,.stDeployButton {{ display:none!important; }}
header[data-testid="stHeader"] {{ display:none!important; }}
</style>
""", unsafe_allow_html=True)


# ═══════════════════════════════════════════════════════════════════════════════
#  API HELPERS
# ═══════════════════════════════════════════════════════════════════════════════

def _headers():
    return {"Authorization": f"Bearer {st.session_state.token}"} if st.session_state.token else {}


def api_post(endpoint, data=None, json_data=None, files=None, form=False):
    try:
        if form:
            r = requests.post(f"{API_BASE}{endpoint}", data=data, files=files,
                              headers=_headers(), timeout=15)
        else:
            r = requests.post(f"{API_BASE}{endpoint}", json=json_data or data,
                              headers=_headers(), timeout=15)
        return r
    except requests.exceptions.ConnectionError:
        st.error("Cannot reach API server. Start it with: `uvicorn backend.main:app --port 8000`")
        return None


def api_get(endpoint, params=None):
    try:
        r = requests.get(f"{API_BASE}{endpoint}", headers=_headers(),
                         params=params, timeout=15)
        return r
    except requests.exceptions.ConnectionError:
        st.error("Cannot reach API server.")
        return None


def api_delete(endpoint):
    try:
        return requests.delete(f"{API_BASE}{endpoint}", headers=_headers(), timeout=10)
    except requests.exceptions.ConnectionError:
        return None


# ── Confidence bar helper ──────────────────────────────────────────────────────
def render_conf_bars(proba: dict, positive_label: str):
    st.markdown("<div class='s-lbl'>Confidence breakdown</div>", unsafe_allow_html=True)
    for label, pct in proba.items():
        is_pos = label == positive_label
        bar_color = (
            "linear-gradient(90deg,#a32d2d,#e24b4a)" if is_pos and pct > 50
            else "linear-gradient(90deg,#0f6e56,#1d9e75)" if not is_pos and pct > 50
            else "rgba(30,60,100,0.6)"
        )
        st.markdown(f"""
        <div class="conf-row">
            <div class="conf-hdr">
                <span class="conf-name">{label}</span>
                <span class="conf-pct">{pct:.1f}%</span>
            </div>
            <div class="conf-track">
                <div style="height:100%;width:{pct}%;background:{bar_color};
                            border-radius:3px;transition:width 0.7s ease;"></div>
            </div>
        </div>""", unsafe_allow_html=True)


def render_result(result: dict):
    label = result["result_label"]
    conf  = result["confidence"]
    risk  = result["risk_level"]
    ms    = result.get("inference_ms", 0) or 0
    proba = result.get("probabilities") or {}
    is_pos = risk in ("high", "moderate")
    now   = datetime.now().strftime("%Y-%m-%d %H:%M")

    if is_pos:
        st.markdown(f"""
        <div class="r-pos">
            <div class="r-lbl-pos">⚠ {risk.upper()} RISK DETECTED</div>
            <div class="r-title r-title-pos">{label}</div>
            <div class="r-sub">Confidence: {conf:.1f}%</div>
            <div class="r-disc">
                AI-generated prediction — always confirm with a licensed clinician.
            </div>
        </div>""", unsafe_allow_html=True)
    else:
        st.markdown(f"""
        <div class="r-neg">
            <div class="r-lbl-neg">✓ LOW RISK</div>
            <div class="r-title r-title-neg">{label}</div>
            <div class="r-sub">Confidence: {conf:.1f}%</div>
            <div class="r-disc">
                No strong indication detected. Continue regular check-ups.
            </div>
        </div>""", unsafe_allow_html=True)

    st.markdown(f"""
    <div class="meta-strip">
        <span>🕐 {now}</span>
        <span>⚡ {ms:.0f} ms</span>
        <span>🔬 {result.get('disease_module','')}</span>
    </div>""", unsafe_allow_html=True)

    if proba:
        render_conf_bars(proba, label)

    # Download PDF if available
    if result.get("report_path") or risk == "high":
        if result.get("id"):
            st.markdown("<br>", unsafe_allow_html=True)
            if st.button("📄 Download PDF Report"):
                r = api_get(f"/reports/{result['id']}")
                if r and r.status_code == 200:
                    st.download_button(
                        "⬇ Save PDF",
                        data=r.content,
                        file_name=f"AarogyaAI_Report_{result['id']}.pdf",
                        mime="application/pdf",
                    )
                else:
                    st.info("PDF generating — please check back in a moment.")


# ═══════════════════════════════════════════════════════════════════════════════
#  TOP BAR & SIDEBAR
# ═══════════════════════════════════════════════════════════════════════════════

def render_topbar(page_name: str):
    user_tag = ""
    if st.session_state.user:
        user_tag = f"""<div class="tb-user">👤 {st.session_state.user['full_name']}</div>"""
    st.markdown(f"""
    <div class="topbar">
        <div class="tb-brand">
            <div class="tb-logo">🧬</div>
            <span class="tb-name">AarogyaAI</span>
            <span class="tb-badge">v2.2.0</span>
        </div>
        <div class="tb-right">
            {user_tag}
            <div style="display:flex;align-items:center;gap:7px;font-size:0.76rem;color:#4a7090;">
                <div class="status-dot"></div>
                {page_name}
            </div>
        </div>
    </div>""", unsafe_allow_html=True)


def render_back_to_dashboard():
    if st.session_state.page == "Dashboard":
        return
    c1, _ = st.columns([1, 4])
    with c1:
        if st.button("< Back to Dashboard", key=f"back_{st.session_state.page}"):
            st.session_state.page = "Dashboard"
            st.rerun()


def render_sidebar():
    if not st.session_state.token:
        return

    with st.sidebar:
        st.markdown(f"""
        <div style="padding:20px 20px 12px;border-bottom:1px solid rgba(29,158,117,0.15);margin-bottom:10px;">
            <div style="display:flex;align-items:center;gap:10px;">
                <div style="width:36px;height:36px;background:linear-gradient(135deg,#1d9e75,#0f6e56);
                            border-radius:9px;display:flex;align-items:center;justify-content:center;
                            font-size:19px;box-shadow:0 0 14px rgba(29,158,117,0.4);">🧬</div>
                <div>
                    <div style="font-size:1rem;font-weight:800;color:#e8f4ee;">AarogyaAI</div>
                    <div style="font-size:0.62rem;color:#1d6a4a;font-family:'JetBrains Mono',monospace;">AI Diagnosis · v2.2.0</div>
                </div>
            </div>
        </div>
        <div style="padding:4px 20px 6px;font-size:0.60rem;color:#1e3a50;letter-spacing:2px;text-transform:uppercase;">Navigation</div>
        """, unsafe_allow_html=True)

        pages = [
            ("🏠", "Dashboard"),
            ("🧬", "Run Diagnosis"),
            ("🗄", "Health Locker"),
            ("📋", "My Predictions"),
            ("👨‍⚕️", "Find a Doctor"),
            ("ℹ️",  "About"),
        ]
        options = [f"{e}  {n}" for e, n in pages]
        page_map = {f"{e}  {n}": n for e, n in pages}
        current_label = next(
            (f"{e}  {n}" for e, n in pages if n == st.session_state.page), options[0]
        )
        current_idx = options.index(current_label) if current_label in options else 0
        sel = st.radio("nav", options, index=current_idx, label_visibility="collapsed")
        st.session_state.page = page_map[sel]

        # Session stats
        preds = st.session_state.pred_log
        pos = sum(1 for p in preds if p.get("risk_level") in ("high", "moderate"))
        st.markdown(f"""
        <div style="margin:16px 10px 0;padding:14px 16px;
                    background:rgba(4,12,24,0.72); border:1px solid rgba(255,255,255,0.06);
                    border-radius:11px; backdrop-filter:blur(12px);">
            <div style="font-size:0.60rem;color:#1e3a50;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:10px;">Session</div>
            <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
                <span style="font-size:0.76rem;color:#3a6080;">Diagnoses run</span>
                <span style="font-family:'JetBrains Mono',monospace;font-size:0.88rem;color:#1d9e75;font-weight:700;">{len(preds)}</span>
            </div>
            <div style="display:flex;justify-content:space-between;">
                <span style="font-size:0.76rem;color:#3a6080;">High risk</span>
                <span style="font-family:'JetBrains Mono',monospace;font-size:0.88rem;color:{'#e24b4a' if pos else '#2a5040'};font-weight:700;">{pos}</span>
            </div>
        </div>
        <div style="margin:14px 10px 0;padding:12px 14px;background:rgba(20,8,8,0.48);
                    border:1px solid rgba(163,45,45,0.15);border-radius:9px;
                    font-size:0.71rem;color:#3a2020;line-height:1.6;">
            <div style="color:#6a2a2a;margin-bottom:4px;font-weight:700;font-size:0.68px;letter-spacing:.5px;">⚠ DISCLAIMER</div>
            Educational & research use only.<br>Not a substitute for medical advice.
        </div>
        """, unsafe_allow_html=True)

        st.markdown("<br>", unsafe_allow_html=True)
        if st.button("🚪 Log out"):
            st.session_state.token = None
            st.session_state.user  = None
            st.session_state.page  = "login"
            st.session_state.pred_log = []
            st.rerun()


# ═══════════════════════════════════════════════════════════════════════════════
#  PAGE: LOGIN / REGISTER
# ═══════════════════════════════════════════════════════════════════════════════

def page_auth():
    render_topbar("🔐 Authentication")
    st.markdown("""
    <div class="login-wrap">
        <div class="login-logo">
            <div class="login-logo-icon">🧬</div>
            <div class="login-title">AarogyaAI</div>
            <div class="login-sub">AI-Powered Medical Diagnosis System</div>
        </div>
    </div>
    """, unsafe_allow_html=True)

    # Centre the form using columns
    _, col, _ = st.columns([1, 2, 1])
    with col:
        tab_l, tab_r = st.tabs(["  Sign In  ", "  Create Account  "])

        with tab_l:
            with st.form("login_form"):
                email = st.text_input("Email address", placeholder="you@example.com")
                pwd   = st.text_input("Password", type="password", placeholder="••••••••")
                submit = st.form_submit_button("Sign In →")
            if submit:
                r = api_post("/auth/login", form=True,
                             data={"username": email, "password": pwd})
                if r and r.status_code == 200:
                    data = r.json()
                    st.session_state.token = data["access_token"]
                    st.session_state.user  = data
                    st.session_state.page  = "Dashboard"
                    st.rerun()
                elif r:
                    st.markdown('<div class="error-b">Invalid email or password.</div>',
                                unsafe_allow_html=True)

        with tab_r:
            with st.form("reg_form"):
                c1, c2 = st.columns(2)
                full_name = st.text_input("Full name *", placeholder="Riya Sharma")
                email_r   = st.text_input("Email address *", placeholder="you@example.com")
                pwd_r     = st.text_input("Password *", type="password", placeholder="Min 8 chars")
                c1, c2 = st.columns(2)
                age    = c1.number_input("Age", 1, 120, 30)
                gender = c2.selectbox("Gender", ["Prefer not to say", "Male", "Female", "Other"])
                c1, c2 = st.columns(2)
                blood  = c1.selectbox("Blood group", ["Unknown", "A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"])
                phone  = c2.text_input("Phone", placeholder="+91-XXXXXXXXXX")
                reg_btn = st.form_submit_button("Create Account →")

            if reg_btn:
                if len(pwd_r) < 8:
                    st.markdown('<div class="error-b">Password must be at least 8 characters.</div>',
                                unsafe_allow_html=True)
                else:
                    r = api_post("/auth/register", json_data={
                        "full_name": full_name, "email": email_r, "password": pwd_r,
                        "age": age,
                        "gender": gender if gender != "Prefer not to say" else None,
                        "blood_group": blood if blood != "Unknown" else None,
                        "phone": phone or None,
                    })
                    if r and r.status_code == 201:
                        data = r.json()
                        st.session_state.token = data["access_token"]
                        st.session_state.user  = data
                        st.session_state.page  = "Dashboard"
                        st.rerun()
                    elif r:
                        err = r.json().get("detail", "Registration failed.")
                        st.markdown(f'<div class="error-b">{err}</div>', unsafe_allow_html=True)

    st.markdown("""
    <div style="text-align:center;margin-top:28px;font-size:0.74rem;color:#1a3040;">
        AarogyaAI v2.2.0 · Educational use only · MIT License
    </div>""", unsafe_allow_html=True)


# ═══════════════════════════════════════════════════════════════════════════════
#  PAGE: DASHBOARD
# ═══════════════════════════════════════════════════════════════════════════════

def page_dashboard():
    u = st.session_state.user or {}
    n = len(st.session_state.pred_log)
    pos = sum(1 for p in st.session_state.pred_log if p.get("risk_level") in ("high","moderate"))

    st.markdown(f"""
    <div class="page-hero">
        <div class="hero-eye">AI · Healthcare · Production v2.2.0</div>
        <div class="hero-h">Welcome back, {u.get('full_name','').split()[0]} 👋</div>
        <div class="hero-s">Your AI-powered health dashboard. Run a diagnosis, manage your health locker, download reports, and find specialist doctors — all in one place.</div>
    </div>
    """, unsafe_allow_html=True)

    st.markdown(f"""
    <div class="stat-grid">
        <div class="stat-card"><div class="stat-v">6</div><div class="stat-l">Disease Modules</div><div class="stat-d">CNN · XGBoost · SVM · RF</div></div>
        <div class="stat-card"><div class="stat-v">{n}</div><div class="stat-l">Diagnoses Run</div><div class="stat-d">{"⚠ " + str(pos) + " high risk" if pos else "✓ all clear"}</div></div>
        <div class="stat-card"><div class="stat-v">🗄</div><div class="stat-l">Health Locker</div><div class="stat-d">Secure report storage</div></div>
        <div class="stat-card"><div class="stat-v">📄</div><div class="stat-l">PDF Reports</div><div class="stat-d">Auto-generated on high risk</div></div>
    </div>
    """, unsafe_allow_html=True)

    st.markdown("<div class='s-lbl'>Quick actions</div>", unsafe_allow_html=True)
    c1, c2, c3 = st.columns(3)
    if c1.button("🧬  Run a Diagnosis"):
        st.session_state.page = "Run Diagnosis"; st.rerun()
    if c2.button("🗄  Open Health Locker"):
        st.session_state.page = "Health Locker"; st.rerun()
    if c3.button("👨‍⚕️  Find a Doctor"):
        st.session_state.page = "Find a Doctor"; st.rerun()

    st.markdown("<br>", unsafe_allow_html=True)
    st.markdown("""
    <div class="info-b">💡 Select a diagnosis module from the sidebar to run an AI-powered assessment. High-risk results automatically generate a downloadable PDF report.</div>
    <div class="warn-b">⚠ AI predictions are probabilistic. Always consult a qualified clinician before making medical decisions.</div>
    """, unsafe_allow_html=True)


# ═══════════════════════════════════════════════════════════════════════════════
#  PAGE: RUN DIAGNOSIS
# ═══════════════════════════════════════════════════════════════════════════════

def page_diagnosis():
    render_back_to_dashboard()
    st.markdown("""
    <div class="page-hero">
        <div class="hero-eye">AI Models · 6 Modules · Real-time Inference</div>
        <div class="hero-h">🧬 Run Diagnosis</div>
        <div class="hero-s">Select a disease module, enter the patient's data, and get an AI-powered risk assessment with confidence scores and specialist recommendations.</div>
    </div>
    """, unsafe_allow_html=True)

    module_tab = st.selectbox(
        "Select disease module",
        [
            "Blood Cell Cancer (ALL)",
            "Heart Disease",
            "Lung Cancer",
            "Parkinson's Disease",
            "Thyroid Disorder",
            "Diabetes",
        ],
        label_visibility="visible",
    )

    st.markdown("<br>", unsafe_allow_html=True)

    # ── Blood Cell Cancer ────────────────────────────────────────────────────
    if module_tab == "Blood Cell Cancer (ALL)":
        st.markdown('<div class="g-card">', unsafe_allow_html=True)
        st.markdown('<div class="f-sec">Microscopy image</div>', unsafe_allow_html=True)
        img_file = st.file_uploader("Upload blood smear image (JPG/PNG)", type=["jpg", "jpeg", "png"])

        if img_file is not None:
            st.image(img_file, caption="Preview", use_column_width=True)

        st.markdown('</div>', unsafe_allow_html=True)
        predict = st.button("Run Blood Cell Prediction ↗")
        if predict:
            if img_file is None:
                st.markdown('<div class="error-b">Please upload an image first.</div>',
                            unsafe_allow_html=True)
            else:
                img_b64 = base64.b64encode(img_file.getvalue()).decode("utf-8")
                r = api_post("/predict/blood_cell", json_data={
                    "features": {},
                    "image_b64": img_b64,
                })
                if r and r.status_code == 200:
                    result = r.json()
                    result["disease_module"] = "blood_cell_cancer"
                    st.session_state.pred_log.append(result)
                    render_result(result)
                elif r:
                    st.markdown(f'<div class="error-b">{r.json().get("detail","Prediction failed.")}</div>',
                                unsafe_allow_html=True)

    # ── Heart Disease ─────────────────────────────────────────────────────────
    elif module_tab == "Heart Disease":
        st.markdown('<div class="g-card">', unsafe_allow_html=True)
        st.markdown('<div class="f-sec">Demographic</div>', unsafe_allow_html=True)
        c1, c2 = st.columns(2)
        age = c1.number_input("Age", 18, 100, 55, key="hd_age")
        sex = c2.selectbox("Sex", ["Male (1)", "Female (0)"], key="hd_sex")

        st.markdown('<div class="f-sec" style="margin-top:14px;">Cardiac assessment</div>', unsafe_allow_html=True)
        c1, c2 = st.columns(2)
        cp       = c1.selectbox("Chest pain type", ["0-Typical","1-Atypical","2-Non-anginal","3-Asymptomatic"], key="hd_cp")
        trestbps = c2.number_input("Resting BP (mmHg)", 80, 220, 130, key="hd_bp")
        chol     = c1.number_input("Cholesterol (mg/dL)", 100, 600, 240, key="hd_chol")
        thalach  = c2.number_input("Max heart rate", 60, 220, 150, key="hd_thal")
        oldpeak  = c1.number_input("ST depression", 0.0, 7.0, 1.0, step=0.1, key="hd_op")
        ca       = c2.selectbox("Major vessels (0–3)", [0,1,2,3], key="hd_ca")

        st.markdown('<div class="f-sec" style="margin-top:14px;">Lab & ECG</div>', unsafe_allow_html=True)
        c1, c2, c3 = st.columns(3)
        fbs     = c1.selectbox("FBS > 120?", ["No (0)","Yes (1)"], key="hd_fbs")
        restecg = c2.selectbox("Resting ECG", ["Normal (0)","ST (1)","LVH (2)"], key="hd_ecg")
        exang   = c3.selectbox("Exercise angina", ["No (0)","Yes (1)"], key="hd_exang")
        slope   = c1.selectbox("ST slope", ["Up (0)","Flat (1)","Down (2)"], key="hd_slope")
        thal    = c2.selectbox("Thalassemia", ["Normal (1)","Fixed (2)","Rev (3)"], key="hd_thal2")

        st.markdown('</div>', unsafe_allow_html=True)
        predict = st.button("Run Heart Disease Prediction ↗")
        if predict:
            features = {
                "age": age, "sex": int(sex[0]),
                "cp": int(cp[0]), "trestbps": trestbps, "chol": chol,
                "fbs": int(fbs[-2]), "restecg": int(restecg[-2]),
                "thalach": thalach, "exang": int(exang[-2]),
                "oldpeak": oldpeak, "slope": int(slope[-2]),
                "ca": ca, "thal": int(thal[-2]),
            }
            r = api_post("/predict/heart_disease", json_data={"features": features})
            if r and r.status_code == 200:
                result = r.json()
                result["disease_module"] = "heart_disease"
                st.session_state.pred_log.append(result)
                render_result(result)
            elif r:
                st.markdown(f'<div class="error-b">{r.json().get("detail","Prediction failed.")}</div>',
                            unsafe_allow_html=True)

    # ── Lung Cancer ───────────────────────────────────────────────────────────
    elif module_tab == "Lung Cancer":
        st.markdown('<div class="g-card">', unsafe_allow_html=True)
        st.markdown('<div class="f-sec">Demographic</div>', unsafe_allow_html=True)
        c1, c2 = st.columns(2)
        gender = c1.selectbox("Gender", ["Male (1)", "Female (0)"], key="lc_g")
        age_l  = c2.number_input("Age", 20, 100, 55, key="lc_age")

        st.markdown('<div class="f-sec" style="margin-top:14px;">Lifestyle</div>', unsafe_allow_html=True)
        c1, c2, c3 = st.columns(3)
        smoking  = c1.selectbox("Smoking",         ["No (1)","Yes (2)"], key="lc_sm")
        alcohol  = c2.selectbox("Alcohol",          ["No (1)","Yes (2)"], key="lc_al")
        yellow_f = c3.selectbox("Yellow fingers",  ["No (1)","Yes (2)"], key="lc_yf")
        peer_p   = c1.selectbox("Peer pressure",   ["No (1)","Yes (2)"], key="lc_pp")
        anxiety  = c2.selectbox("Anxiety",          ["No (1)","Yes (2)"], key="lc_anx")
        chronic  = c3.selectbox("Chronic disease", ["No (1)","Yes (2)"], key="lc_ch")

        st.markdown('<div class="f-sec" style="margin-top:14px;">Symptoms</div>', unsafe_allow_html=True)
        c1, c2, c3 = st.columns(3)
        fatigue = c1.selectbox("Fatigue",               ["No (1)","Yes (2)"], key="lc_fat")
        allergy = c2.selectbox("Allergy",                ["No (1)","Yes (2)"], key="lc_all")
        wheeze  = c3.selectbox("Wheezing",               ["No (1)","Yes (2)"], key="lc_wh")
        cough   = c1.selectbox("Coughing",               ["No (1)","Yes (2)"], key="lc_co")
        short_b = c2.selectbox("Shortness of breath",   ["No (1)","Yes (2)"], key="lc_sb")
        swallow = c3.selectbox("Swallowing difficulty",  ["No (1)","Yes (2)"], key="lc_sw")
        c1, _ = st.columns(2)
        chest_p = c1.selectbox("Chest pain",             ["No (1)","Yes (2)"], key="lc_cp")

        st.markdown('</div>', unsafe_allow_html=True)
        predict = st.button("Run Lung Cancer Prediction ↗")
        if predict:
            v = lambda s: int(s[-2])
            features = {
                "gender": int(gender[0]), "age": age_l,
                "smoking": v(smoking), "yellow_fingers": v(yellow_f), "anxiety": v(anxiety),
                "peer_pressure": v(peer_p), "chronic_disease": v(chronic), "fatigue": v(fatigue),
                "allergy": v(allergy), "wheezing": v(wheeze), "alcohol_consuming": v(alcohol),
                "coughing": v(cough), "shortness_of_breath": v(short_b),
                "swallowing_difficulty": v(swallow), "chest_pain": v(chest_p),
            }
            r = api_post("/predict/lung_cancer", json_data={"features": features})
            if r and r.status_code == 200:
                result = r.json(); result["disease_module"] = "lung_cancer"
                st.session_state.pred_log.append(result); render_result(result)
            elif r:
                st.markdown(f'<div class="error-b">{r.json().get("detail","Prediction failed.")}</div>', unsafe_allow_html=True)

    # ── Diabetes ──────────────────────────────────────────────────────────────
    elif module_tab == "Diabetes":
        st.markdown('<div class="g-card">', unsafe_allow_html=True)
        st.markdown('<div class="f-sec">Reproductive & metabolic</div>', unsafe_allow_html=True)
        c1, c2 = st.columns(2)
        preg = c1.number_input("Pregnancies", 0, 20, 3, key="db_preg")
        gluc = c2.number_input("Glucose (mg/dL)", 50, 250, 120, key="db_gl")

        st.markdown('<div class="f-sec" style="margin-top:14px;">Cardiovascular & body</div>', unsafe_allow_html=True)
        c1, c2 = st.columns(2)
        bp   = c1.number_input("Blood pressure (mmHg)", 40, 130, 70, key="db_bp")
        skin = c2.number_input("Skin thickness (mm)", 0, 99, 20, key="db_sk")
        c1, c2 = st.columns(2)
        bmi  = c1.number_input("BMI", 15.0, 70.0, 32.0, step=0.1, format="%.1f", key="db_bmi")
        ins  = c2.number_input("Insulin (μU/mL)", 0, 900, 79, key="db_ins")

        st.markdown('<div class="f-sec" style="margin-top:14px;">Genetic & age</div>', unsafe_allow_html=True)
        c1, c2 = st.columns(2)
        dpf  = c1.number_input("Diabetes pedigree fn", 0.0, 2.5, 0.471, step=0.001, format="%.3f", key="db_dpf")
        age  = c2.number_input("Age", 21, 100, 33, key="db_age")

        st.markdown('</div>', unsafe_allow_html=True)
        predict = st.button("Run Diabetes Prediction ↗")
        if predict:
            features = {"Pregnancies": preg, "Glucose": gluc, "BloodPressure": bp,
                        "SkinThickness": skin, "Insulin": ins, "BMI": bmi,
                        "DiabetesPedigreeFunction": dpf, "Age": age}
            r = api_post("/predict/diabetes", json_data={"features": features})
            if r and r.status_code == 200:
                result = r.json(); result["disease_module"] = "diabetes"
                st.session_state.pred_log.append(result); render_result(result)
            elif r:
                st.markdown(f'<div class="error-b">{r.json().get("detail","Prediction failed.")}</div>', unsafe_allow_html=True)

    # ── Thyroid ───────────────────────────────────────────────────────────────
    elif module_tab == "Thyroid Disorder":
        st.markdown('<div class="g-card">', unsafe_allow_html=True)
        c1, c2, c3 = st.columns(3)
        age_t   = c1.number_input("Age", 1, 100, 45, key="th_age")
        sex_t   = c2.selectbox("Sex", ["Male (1)", "Female (0)"], key="th_sex")
        on_thyr = c3.selectbox("On thyroxine", ["No (0)", "Yes (1)"], key="th_thyr")
        c1, c2, c3 = st.columns(3)
        tsh = c1.number_input("TSH", 0.0, 500.0, 1.30, format="%.2f", key="th_tsh")
        t3  = c2.number_input("T3",  0.0,  10.0, 2.50, format="%.2f", key="th_t3")
        tt4 = c3.number_input("TT4", 0.0, 500.0, 107.0, format="%.1f", key="th_tt4")
        c1, c2 = st.columns(2)
        t4u = c1.number_input("T4U", 0.0, 3.0, 1.02, format="%.2f", key="th_t4u")
        fti = c2.number_input("FTI", 0.0, 400.0, 105.0, format="%.1f", key="th_fti")
        c1, c2, c3, c4 = st.columns(4)
        goitre = c1.selectbox("Goitre",        ["No (0)","Yes (1)"], key="th_go")
        tumor  = c2.selectbox("Tumor",         ["No (0)","Yes (1)"], key="th_tu")
        hypop  = c3.selectbox("Hypopituitary", ["No (0)","Yes (1)"], key="th_hp")
        psych  = c4.selectbox("Psych symptoms",["No (0)","Yes (1)"], key="th_ps")
        st.markdown('</div>', unsafe_allow_html=True)

        predict = st.button("Run Thyroid Prediction ↗")
        if predict:
            v = lambda s: int(s[-2])
            features = {
                "age": age_t, "sex": v(sex_t), "on_thyroxine": v(on_thyr),
                "TSH": tsh, "T3": t3, "TT4": tt4, "T4U": t4u, "FTI": fti,
                "goitre": v(goitre), "tumor": v(tumor),
                "hypopituitary": v(hypop), "psych": v(psych),
            }
            r = api_post("/predict/thyroid", json_data={"features": features})
            if r and r.status_code == 200:
                result = r.json(); result["disease_module"] = "thyroid"
                st.session_state.pred_log.append(result); render_result(result)
            elif r:
                st.markdown(f'<div class="error-b">{r.json().get("detail","Prediction failed.")}</div>', unsafe_allow_html=True)

    # ── Parkinson's ───────────────────────────────────────────────────────────
    elif module_tab == "Parkinson's Disease":
        st.markdown('<div class="g-card">', unsafe_allow_html=True)
        st.markdown('<div class="f-sec">Frequency measures (Hz)</div>', unsafe_allow_html=True)
        c1, c2, c3 = st.columns(3)
        fo  = c1.number_input("MDVP:Fo",   80.0,  270.0, 154.229, format="%.3f", key="pk_fo")
        fhi = c2.number_input("MDVP:Fhi", 100.0,  600.0, 197.105, format="%.3f", key="pk_fhi")
        flo = c3.number_input("MDVP:Flo",  60.0,  240.0, 116.324, format="%.3f", key="pk_flo")

        st.markdown('<div class="f-sec" style="margin-top:14px;">Jitter measures</div>', unsafe_allow_html=True)
        c1, c2, c3, c4, c5 = st.columns(5)
        jitter   = c1.number_input("Jitter(%)",    0.001,0.05,   0.00662,  format="%.5f", key="pk_j")
        jitter_a = c2.number_input("Jitter(Abs)", 0.00001,0.0003,0.0000441,format="%.7f", key="pk_ja")
        rap      = c3.number_input("RAP",          0.001,0.03,   0.00401,  format="%.5f", key="pk_rap")
        ppq      = c4.number_input("PPQ",          0.001,0.03,   0.00317,  format="%.5f", key="pk_ppq")
        ddp      = c5.number_input("DDP",          0.001,0.10,   0.01204,  format="%.5f", key="pk_ddp")

        st.markdown('<div class="f-sec" style="margin-top:14px;">Shimmer & nonlinear dynamics</div>', unsafe_allow_html=True)
        c1, c2, c3, c4 = st.columns(4)
        shimmer = c1.number_input("Shimmer",   0.010,0.200,0.09799,format="%.5f",key="pk_sh")
        shim_db = c2.number_input("Shim(dB)", 0.100,2.000,0.96500,format="%.3f", key="pk_shdb")
        apq3    = c3.number_input("APQ3",     0.001,0.100,0.00690,format="%.5f",key="pk_apq3")
        apq5    = c4.number_input("APQ5",     0.001,0.150,0.01198,format="%.5f",key="pk_apq5")
        c1, c2, c3, c4 = st.columns(4)
        apq     = c1.number_input("APQ",      0.010,0.150,0.01226,format="%.5f",key="pk_apq")
        dda     = c2.number_input("DDA",      0.001,0.300,0.02085,format="%.5f",key="pk_dda")
        nhr     = c3.number_input("NHR",      0.000,0.500,0.00997,format="%.5f",key="pk_nhr")
        hnr     = c4.number_input("HNR",      8.000,35.00,24.678, format="%.3f", key="pk_hnr")
        c1, c2, c3, c4 = st.columns(4)
        rpde    = c1.number_input("RPDE",    0.200,0.700,0.46886,format="%.5f",key="pk_rpde")
        dfa     = c2.number_input("DFA",     0.500,0.900,0.71826,format="%.5f",key="pk_dfa")
        d2      = c3.number_input("D2",      1.000,4.000,2.301,  format="%.3f", key="pk_d2")
        ppe     = c4.number_input("PPE",     0.050,0.500,0.28468,format="%.5f",key="pk_ppe")
        c1, c2 = st.columns(2)
        spread1 = c1.number_input("spread1",-8.000,-1.000,-5.684,format="%.3f", key="pk_s1")
        spread2 = c2.number_input("spread2", 0.000,0.500,0.22694,format="%.5f",key="pk_s2")

        st.markdown('</div>', unsafe_allow_html=True)
        predict = st.button("Run Parkinson's Prediction ↗")
        if predict:
            features = {
                "MDVP_Fo": fo, "MDVP_Fhi": fhi, "MDVP_Flo": flo,
                "MDVP_Jitter_pct": jitter, "MDVP_Jitter_Abs": jitter_a,
                "MDVP_RAP": rap, "MDVP_PPQ": ppq, "Jitter_DDP": ddp,
                "MDVP_Shimmer": shimmer, "MDVP_Shimmer_dB": shim_db,
                "Shimmer_APQ3": apq3, "Shimmer_APQ5": apq5, "MDVP_APQ": apq,
                "Shimmer_DDA": dda, "NHR": nhr, "HNR": hnr,
                "RPDE": rpde, "DFA": dfa, "spread1": spread1, "spread2": spread2,
                "D2": d2, "PPE": ppe,
            }
            r = api_post("/predict/parkinsons", json_data={"features": features})
            if r and r.status_code == 200:
                result = r.json(); result["disease_module"] = "parkinsons"
                st.session_state.pred_log.append(result); render_result(result)
            elif r:
                st.markdown(f'<div class="error-b">{r.json().get("detail","Prediction failed.")}</div>', unsafe_allow_html=True)


# ═══════════════════════════════════════════════════════════════════════════════
#  PAGE: HEALTH LOCKER
# ═══════════════════════════════════════════════════════════════════════════════

def page_locker():
    render_back_to_dashboard()
    st.markdown("""
    <div class="page-hero">
        <div class="hero-eye">Secure · Encrypted · Personal</div>
        <div class="hero-h">🗄 Health Locker</div>
        <div class="hero-s">Store vital measurements and upload lab reports, prescriptions, and diagnostic images securely. All data is linked to your account only.</div>
    </div>
    """, unsafe_allow_html=True)

    tab_vitals, tab_uploads = st.tabs(["  📊 Vitals Records  ", "  📁 Uploaded Reports  "])

    # ── Vitals ────────────────────────────────────────────────────────────────
    with tab_vitals:
        st.markdown("<div class='s-lbl'>Add new record</div>", unsafe_allow_html=True)
        with st.form("add_record"):
            title = st.text_input("Record title *", placeholder="e.g. Annual checkup June 2025")
            notes = st.text_area("Notes", placeholder="Doctor's remarks, context...", height=80)
            c1, c2, c3 = st.columns(3)
            weight = c1.number_input("Weight (kg)", 0.0, 300.0, 0.0, step=0.1, format="%.1f")
            height = c2.number_input("Height (cm)", 0.0, 250.0, 0.0, step=0.1, format="%.1f")
            glucose = c3.number_input("Glucose (mg/dL)", 0.0, 500.0, 0.0, step=0.1, format="%.1f")
            c1, c2, c3 = st.columns(3)
            bp_sys  = c1.number_input("BP Systolic", 0, 300, 0)
            bp_dia  = c2.number_input("BP Diastolic", 0, 200, 0)
            hr      = c3.number_input("Heart rate (bpm)", 0, 250, 0)
            c1, c2 = st.columns(2)
            chol = c1.number_input("Cholesterol (mg/dL)", 0.0, 700.0, 0.0, step=0.1, format="%.1f")
            temp = c2.number_input("Temperature (°C)", 0.0, 45.0, 0.0, step=0.1, format="%.1f")
            save = st.form_submit_button("Save Record ↗")

        if save and title:
            payload = {k: v for k, v in {
                "title": title, "notes": notes or None,
                "weight_kg": weight or None, "height_cm": height or None,
                "bp_systolic": bp_sys or None, "bp_diastolic": bp_dia or None,
                "glucose": glucose or None, "cholesterol": chol or None,
                "heart_rate": hr or None, "temperature": temp or None,
            }.items() if v}
            r = api_post("/records", json_data=payload)
            if r and r.status_code == 201:
                st.success("✓ Record saved successfully!")
            elif r:
                st.error(r.json().get("detail", "Failed to save."))

        # List records
        st.markdown("<br><div class='s-lbl'>Your health records</div>", unsafe_allow_html=True)
        r = api_get("/records")
        if r and r.status_code == 200:
            records = r.json()
            if not records:
                st.markdown('<div class="info-b">No records yet. Add your first vitals record above.</div>', unsafe_allow_html=True)
            for rec in reversed(records):
                date = rec["recorded_at"][:10]
                st.markdown(f"""
                <div class="g-card-sm" style="margin-bottom:12px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                        <div style="font-size:0.9rem;font-weight:700;color:#d8eaff;">{rec['title']}</div>
                        <div style="font-family:'JetBrains Mono',monospace;font-size:0.68rem;color:#2a5070;">{date}</div>
                    </div>
                    <div style="display:flex;gap:20px;flex-wrap:wrap;">
                        {"".join(f'<span style="font-size:0.78rem;color:#4a7090;">{k}: <span style="color:#c8dff0;">{v}</span></span>' for k,v in {
                            "Weight": f"{rec['weight_kg']} kg" if rec.get('weight_kg') else None,
                            "Height": f"{rec['height_cm']} cm" if rec.get('height_cm') else None,
                            "BMI": rec.get('bmi'), "BP": f"{rec['bp_systolic']}/{rec['bp_diastolic']}" if rec.get('bp_systolic') else None,
                            "Glucose": rec.get('glucose'), "Cholesterol": rec.get('cholesterol'),
                            "HR": f"{rec['heart_rate']} bpm" if rec.get('heart_rate') else None,
                        }.items() if v)}
                    </div>
                    {f'<div style="font-size:0.78rem;color:#3a6080;margin-top:8px;">{rec["notes"]}</div>' if rec.get("notes") else ""}
                </div>""", unsafe_allow_html=True)

    # ── File uploads ──────────────────────────────────────────────────────────
    with tab_uploads:
        st.markdown("<div class='s-lbl'>Upload a lab report or document</div>", unsafe_allow_html=True)
        uploaded_file = st.file_uploader(
            "PDF, JPG, or PNG · Max 10 MB",
            type=["pdf", "jpg", "jpeg", "png"],
            label_visibility="collapsed",
        )
        c1, c2 = st.columns(2)
        desc     = c1.text_input("Description", placeholder="e.g. CBC Blood Test Report")
        category = c2.selectbox("Category", ["Blood Test", "Urine Test", "X-Ray / Scan",
                                              "Prescription", "ECG", "MRI / CT", "Other"])

        if uploaded_file and st.button("Upload to Locker ↗"):
            files   = {"file": (uploaded_file.name, uploaded_file.getvalue(), uploaded_file.type)}
            form_d  = {"description": desc or "", "category": category}
            r = api_post("/uploads", form=True, data=form_d, files=files)
            if r and r.status_code == 201:
                st.success(f"✓ {uploaded_file.name} uploaded successfully!")
            elif r:
                st.error(r.json().get("detail", "Upload failed."))

        st.markdown("<br><div class='s-lbl'>Stored documents</div>", unsafe_allow_html=True)
        r = api_get("/uploads")
        if r and r.status_code == 200:
            uploads = r.json()
            if not uploads:
                st.markdown('<div class="info-b">No documents uploaded yet.</div>', unsafe_allow_html=True)
            for up in reversed(uploads):
                date = up["uploaded_at"][:10]
                size = f"{up['file_size_kb']:.1f} KB" if up.get("file_size_kb") else ""
                st.markdown(f"""
                <div class="upload-row">
                    <div>
                        <div class="upload-name">📄 {up['filename']}</div>
                        <div class="upload-meta">{up.get('category','')} · {size} · {date} · {up.get('description','')}</div>
                    </div>
                </div>""", unsafe_allow_html=True)
                col_dl, col_del, _ = st.columns([1, 1, 4])
                if col_dl.button("⬇ Download", key=f"dl_{up['id']}"):
                    dr = api_get(f"/uploads/{up['id']}/download")
                    if dr and dr.status_code == 200:
                        st.download_button("Save file", dr.content,
                                           file_name=up["filename"], key=f"save_{up['id']}")
                if col_del.button("🗑 Delete", key=f"del_{up['id']}"):
                    api_delete(f"/uploads/{up['id']}")
                    st.rerun()


# ═══════════════════════════════════════════════════════════════════════════════
#  PAGE: MY PREDICTIONS
# ═══════════════════════════════════════════════════════════════════════════════

def page_predictions():
    render_back_to_dashboard()
    st.markdown("""
    <div class="page-hero">
        <div class="hero-eye">History · Results · Reports</div>
        <div class="hero-h">📋 My Predictions</div>
        <div class="hero-s">Full history of all AI diagnostic assessments. Download PDF reports for high-risk results and track your health over time.</div>
    </div>
    """, unsafe_allow_html=True)

    r = api_get("/predictions", params={"limit": 100})
    if not r or r.status_code != 200:
        st.markdown('<div class="error-b">Could not load predictions.</div>', unsafe_allow_html=True)
        return

    preds = r.json()
    if not preds:
        st.markdown('<div class="info-b">No predictions yet. Run a diagnosis from the sidebar.</div>', unsafe_allow_html=True)
        return

    # Summary pills
    total  = len(preds)
    high   = sum(1 for p in preds if p["risk_level"] == "high")
    mod    = sum(1 for p in preds if p["risk_level"] == "moderate")
    low    = total - high - mod
    st.markdown(f"""
    <div style="display:flex;gap:10px;margin-bottom:20px;flex-wrap:wrap;">
        <span class="m-pill">Total <span>{total}</span></span>
        <span class="m-pill">High risk <span style="color:#e24b4a;">{high}</span></span>
        <span class="m-pill">Moderate <span style="color:#e9a23b;">{mod}</span></span>
        <span class="m-pill">Low risk <span>{low}</span></span>
    </div>
    """, unsafe_allow_html=True)

    for pred in preds:
        risk    = pred["risk_level"]
        module  = pred["disease_module"].replace("_", " ").title()
        date    = pred["created_at"][:16].replace("T", " ")
        conf    = pred["confidence"]
        label   = pred["result_label"]
        r_col   = {"high": "#e24b4a", "moderate": "#e9a23b", "low": "#1d9e75"}.get(risk, "#4a7090")

        with st.expander(f"{'⚠' if risk=='high' else '⚡' if risk=='moderate' else '✓'}  {module} — {label}  ·  {date}"):
            st.markdown(f"""
            <div style="display:flex;gap:14px;flex-wrap:wrap;margin-bottom:14px;">
                <span class="m-pill">Module <span>{module}</span></span>
                <span class="m-pill">Result <span>{label}</span></span>
                <span class="m-pill">Confidence <span>{conf:.1f}%</span></span>
                <span class="m-pill">Risk <span style="color:{r_col};">{risk.upper()}</span></span>
                <span class="m-pill">Date <span>{date}</span></span>
            </div>
            """, unsafe_allow_html=True)

            proba = pred.get("probabilities") or {}
            if proba:
                render_conf_bars(proba, label)

            if pred.get("report_path"):
                if st.button("📄 Download PDF Report", key=f"dl_report_{pred['id']}"):
                    pr = api_get(f"/reports/{pred['id']}")
                    if pr and pr.status_code == 200:
                        st.download_button(
                            "⬇ Save PDF",
                            pr.content,
                            file_name=f"AarogyaAI_Report_{pred['id']}.pdf",
                            mime="application/pdf",
                            key=f"save_report_{pred['id']}",
                        )


# ═══════════════════════════════════════════════════════════════════════════════
#  PAGE: FIND A DOCTOR
# ═══════════════════════════════════════════════════════════════════════════════

def page_doctors():
    render_back_to_dashboard()
    st.markdown("""
    <div class="page-hero">
        <div class="hero-eye">Curated · Verified · Specialist Directory</div>
        <div class="hero-h">👨‍⚕️ Find a Doctor</div>
        <div class="hero-s">Find the right specialist based on your diagnosis. Our curated directory covers oncologists, cardiologists, neurologists, endocrinologists, and pulmonologists across India.</div>
    </div>
    """, unsafe_allow_html=True)

    # Filters
    c1, c2, c3 = st.columns(3)
    specialties = ["All", "Oncologist", "Cardiologist", "Pulmonologist",
                   "Neurologist", "Endocrinologist", "General Physician"]
    spec_filter = c1.selectbox("Specialty", specialties, key="doc_spec")
    city_filter = c2.text_input("City", placeholder="e.g. Mumbai", key="doc_city")
    disease_filter = c3.selectbox("For disease", [
        "Any", "Blood Cell Cancer", "Heart Disease", "Lung Cancer",
        "Parkinson's Disease", "Thyroid Disorder", "Diabetes"
    ], key="doc_dis")

    disease_map = {
        "Blood Cell Cancer": "blood_cell_cancer", "Heart Disease": "heart_disease",
        "Lung Cancer": "lung_cancer", "Parkinson's Disease": "parkinsons",
        "Thyroid Disorder": "thyroid", "Diabetes": "diabetes",
    }

    params = {}
    if spec_filter != "All":
        params["specialty"] = spec_filter
    if city_filter:
        params["city"] = city_filter
    if disease_filter != "Any":
        params["disease_module"] = disease_map[disease_filter]

    r = api_get("/doctors", params=params)
    if not r or r.status_code != 200:
        st.markdown('<div class="error-b">Could not load doctors. Is the API running?</div>', unsafe_allow_html=True)
        return

    doctors = r.json()
    if not doctors:
        st.markdown('<div class="warn-b">No doctors found matching these filters.</div>', unsafe_allow_html=True)
        return

    st.markdown(f"<div class='s-lbl'>{len(doctors)} specialists found</div>", unsafe_allow_html=True)

    cols = st.columns(2)
    for i, doc in enumerate(doctors):
        stars = "★" * int(doc["rating"] or 0) + "☆" * (5 - int(doc["rating"] or 0))
        with cols[i % 2]:
            st.markdown(f"""
            <div class="doc-card">
                <div class="doc-name">Dr. {doc['name'].replace('Dr. ','')}</div>
                <div class="doc-spec">{doc['specialty']}</div>
                <div class="doc-row">🏥 {doc.get('hospital','—')}, {doc.get('city','—')}</div>
                <div class="doc-row">🎓 {doc.get('qualification','—')}</div>
                <div class="doc-row">⏳ {doc.get('experience_yrs','—')} yrs experience</div>
                <div class="doc-row">⭐ {stars}  ({doc.get('rating','—')}/5)</div>
                <div class="doc-row">📞 {doc.get('phone','—')}</div>
                <div class="doc-row">🗓 Available: {doc.get('available_days','—')}</div>
                <div class="doc-row">💰 Consultation: ₹{doc.get('fee_inr','—')}</div>
                <span class="doc-badge">Book Appointment →</span>
            </div>""", unsafe_allow_html=True)


# ═══════════════════════════════════════════════════════════════════════════════
#  PAGE: ABOUT
# ═══════════════════════════════════════════════════════════════════════════════

def page_about():
    render_back_to_dashboard()
    st.markdown("""
    <div class="page-hero">
        <div class="hero-eye">Architecture · Stack · Credits</div>
        <div class="hero-h">ℹ️ About AarogyaAI</div>
        <div class="hero-s">Production-grade AI medical diagnosis system with authentication, health locker, PDF reports, and specialist directory.</div>
    </div>
    """, unsafe_allow_html=True)

    c1, c2 = st.columns(2)
    with c1:
        st.markdown("<div class='s-lbl'>System architecture</div>", unsafe_allow_html=True)
        for layer, detail in [
            ("🌐 Frontend",    "Streamlit — glassmorphism UI, session management"),
            ("⚡ Backend API", "FastAPI — JWT auth, REST endpoints, SQLAlchemy ORM"),
            ("🗄 Database",   "SQLite / PostgreSQL — users, records, predictions, uploads"),
            ("🤖 AI Engine",  "TensorFlow CNN + Scikit-learn ML pipelines"),
            ("📄 Reports",    "fpdf2 — professional multi-page PDF generation"),
            ("👨‍⚕️ Doctors",  "Curated specialist database seeded at startup"),
        ]:
            st.markdown(f"""
            <div class="g-card-sm" style="margin-bottom:8px;">
                <span style="font-size:0.88rem;font-weight:600;color:#d8eaff;">{layer}</span>
                <span style="font-size:0.78rem;color:#3a6080;margin-left:10px;">{detail}</span>
            </div>""", unsafe_allow_html=True)

    with c2:
        st.markdown("<div class='s-lbl'>Tech stack</div>", unsafe_allow_html=True)
        for name, desc in [
            ("Python 3.10+",       "Core language"),
            ("FastAPI",            "REST API + OpenAPI docs"),
            ("Streamlit",          "Web application UI"),
            ("SQLAlchemy",         "ORM + migrations"),
            ("bcrypt + PyJWT",     "Password hashing + JWT auth"),
            ("TensorFlow / Keras", "Blood cell CNN"),
            ("Scikit-Learn",       "ML models + pipelines"),
            ("XGBoost",            "Gradient boosting"),
            ("fpdf2",              "PDF report generation"),
            ("imbalanced-learn",   "SMOTE oversampling"),
        ]:
            st.markdown(f"""
            <div class="g-card-sm" style="margin-bottom:6px;padding:10px 14px;">
                <span style="font-size:0.84rem;font-weight:600;color:#d8eaff;">{name}</span>
                <span style="font-size:0.72rem;color:#2a5070;margin-left:8px;">{desc}</span>
            </div>""", unsafe_allow_html=True)

    st.markdown("""
    <div style="text-align:center;padding:28px 0 8px;font-size:0.74rem;color:#1a3040;">
        AarogyaAI v2.2.0 · MIT License · Educational use only
    </div>""", unsafe_allow_html=True)


# ═══════════════════════════════════════════════════════════════════════════════
#  ROUTER
# ═══════════════════════════════════════════════════════════════════════════════

if not st.session_state.token:
    page_auth()
else:
    render_sidebar()
    page_name = st.session_state.page
    render_topbar(f"{'🏠' if page_name=='Dashboard' else '🧬' if page_name=='Run Diagnosis' else '🗄' if page_name=='Health Locker' else '📋' if page_name=='My Predictions' else '👨‍⚕️' if page_name=='Find a Doctor' else 'ℹ️'}  {page_name}")

    PAGES = {
        "Dashboard":      page_dashboard,
        "Run Diagnosis":  page_diagnosis,
        "Health Locker":  page_locker,
        "My Predictions": page_predictions,
        "Find a Doctor":  page_doctors,
        "About":          page_about,
    }
    PAGES.get(page_name, page_dashboard)()