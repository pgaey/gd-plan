# Spec Critique: spec-03-01

> 독립 Opus 서브에이전트(general-purpose) 비판. 메인 에이전트가 채택분만 spec.md에 반영.

## 1. 유사 기법 조사

### 발견된 패턴/도구
- **Panel/Jury of LLM Judges (Verga et al. 2024)**: 약한 다중 judge 패널이 강한 단일 judge보다 self-preference bias↓ + 인간 합의↑. 핵심은 *모델 다양성*. 현재 spec: worker+director 모델 분리로 다양성 일부 확보하나, **director가 worker를 재정(override)하는 위계**라 패널의 독립 집계 메커니즘이 아님 → director의 model bias가 최종 판정을 지배.
- **Self-Preference Bias (Panickssery et al., NeurIPS 2024 — 인용됨)**: 모델 분리는 올바른 방향. "둘 다 opus" 시 잔존 — spec이 정직하게 명시한 점 적절.
- **Anchoring in sequential review (arXiv 2503.13879 등)**: 첫 리뷰어 anchoring 계수 GPT-4 0.255 > 인간 0.193, 후속 모순 증거에도 지속. CoT/Reflection 같은 약한 처방은 불충분. → spec의 🛑(director 독립성 연성)을 **정량적으로 뒷받침**.
- **Generator-Verifier / MALT**: worker=생성, director=검증+병합은 정합. 단 MALT는 verifier·refiner 분리 — spec은 director에 재비평+병합 2역할 과부하.
- **Homogeneous debate = echo chamber (arXiv 2401.05998 등)**: 동일 아키텍처는 오류 상관→반향실. "둘 다 opus"가 정확히 이 함정. 다양성↓의 실제 비용(허위 신뢰)이 과소 표현.
- **LLMs Cannot Self-Correct Reasoning Yet (Huang et al. 2310.01798)**: 외부 ground-truth 없는 self-correction은 역효과 가능. director에 `prd.md:줄` 근거 강제(무근거 drop)는 좋은 대응. 단 severity *재정*은 주관 판단이라 이 위험에 노출.

### 시사점
- 🛑(anchoring)은 연구로 정량 확인된 강한 효과. director가 worker 보고서를 읽기 전 자기 발견을 **블록으로 고정(commit)** 후에만 worker 보고서를 여는 **순서 강제**가 최소 필수(현재는 의도만, 강제 메커니즘 없음).
- director를 단일 최종 권위자로 두면 패널 bias-분산 효과 상실. 병합을 가능한 **규칙 기반 집계**로 만들수록 bias 노출↓.

## 2. 요구사항 비판

### 누락
- **발견 매칭(dedup) 규약 부재**: "한쪽만 잡음"을 판정하려면 worker·director 발견을 동일 항목으로 매칭하는 키(예: `prd.md:줄`+렌즈 L1/L2/L3 조합)가 필요한데 없음 → 오판정.
- **director 독립 비평의 추적성 부재**: 병합본만 나오면 director가 실제 독립 발견을 했는지 검증 불가 → §4 스키마에 "director 단독/worker 단독/공통" provenance 요구 필요.
- **앵커링 완화 실효 메커니즘 부재**: "보기 전에 형성"이라는 의도만 있고 단일 디스패치 내 강제 구조 없음.
- **severity 재정 근거 요구 없음**: 재정 시 `prd.md:줄`+severity 루브릭 근거 강제 필요(self-correct 위험).
- **폴백 비대칭**: worker 성공+director 실패 시 1차본을 줄 때 "검증 안 된 1차본" 배너 명시 없음.

### 모순
- **요구사항 3 vs §4 스키마**: 요구사항 3은 provenance 표기 요구, Proposed Changes는 §2/§5만 변경하고 §4 스키마 미변경 → 담을 필드 없어 충족 불가.
- **"독립 재비평" vs "병합 시 worker 봄"**: 강한 용어 + 약한 메커니즘. 용어를 낮추거나 메커니즘으로 독립 강제, 둘 중 하나 필요.

### 과잉 설계
- **모델 전환(둘 다 opus)**: echo chamber 모드라 의도적 사용 시나리오 불명. 우선순위 낮음(현 spec처럼 주석만이면 과잉은 아님).

### 모호함
- "독립 재비평(보기 전 형성)" 코드화 방식 미정((a)문장 지시 vs (b)자기 발견 먼저 출력 후 worker 제시 — 실효성 상이).
- "커버리지 갭으로 표면화" 형식(별도 섹션 vs 라인 태그) 미정.
- "근거 못 댐 → drop"의 판정 주체가 worker 표기 신뢰인지 director 직접 재검증인지 모호.
- prdVersion 일관성(worker·director 동일 version 봤다는 표기) 규약 없음.

## 3. 대안 제안

### 대안 A: 병렬 blind 비평 + 별도 merge (3-디스패치)
- **아이디어**: worker·director-critic을 동시·blind 독립 비평 → 3번째 merge(또는 메인 규칙 집계)가 set 연산 병합.
- **장점**: anchoring 원천 차단, 진짜 독립=패널 다양성, provenance 구조적 자명.
- **단점**: 디스패치 3개로 비용·복잡도↑, merge가 judgment 떠안으면 bias 재유입, 협업 이득 포기.

### 대안 B: 2-디스패치 + 순서 강제 (권장)
- **아이디어**: 디스패치 2개 유지, director를 2-페이즈 강제 — 페이즈1=worker 미제시 상태로 자기 발견 완결 출력(commit) → 페이즈2=worker 보고서 주고 병합. provenance·근거재검증·severity 근거를 §4 스키마에 추가.
- **장점**: 비용 불변, anchoring 구조적 완화, 협업 이득 보존, spec 의도 정합.
- **단점**: 완전 blind 아님(잔존 가능, 대폭 완화), 프롬프트 복잡도↑.

### 대안 C: 비위계 패널 + 메인 규칙 집계
- **아이디어**: worker·director 동급 critic, 병합을 결정적 규칙으로 메인이 기계 집계(director 재정 권한 없음).
- **장점**: 패널 bias-분산 유지, 추적성·재현성↑, self-correct 위험 회피.
- **단점**: severity 충돌 단순화 시 over-flag↑, opus judgment 천장 미활용.

## 권장안
**대안 B 기본 채택 + 대안 A를 🛑 명시적 opt-in 대안으로 병기.** 이유: anchoring은 연구로 확인된 실효 위험이라 "의도만 있는 독립성"은 불충분 — 페이즈 분리 강제가 최소 필수. 3-디스패치(A)는 현 phase ROI 대비 비용 과할 수 있고 blind는 협업 이득 상실. **§4 스키마에 provenance·severity 재정 근거·director 단독발견 블록 포함**하도록 Proposed Changes 확장(요구사항 3 ↔ Proposed Changes 모순 해소). 고위험 사용자용으로 A를 opt-in 유지 합리적.

## 4. ADR 후보 추출
- [x] 후보 발견: `critique-two-tier-worker-director-merge` — type: **convention** — 이유: "worker(생성/1차)→director(검증+병합)→사람 triage" 디스패치·병합 규약은 spec-03-02·03-03에서 재사용·강제될 cross-spec 패턴, "메인은 비평 안 함" 불변식과 병합 규칙은 6개월+ 유지될 관례. spec-03-02 재검증 시 convention vs decision(위계 채택) 확정 권장.
