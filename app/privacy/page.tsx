import Link from "next/link";
import type { Metadata } from "next";
import Logo from "@/components/Logo";

export const metadata: Metadata = {
  title: "개인정보처리방침 — BFS OS",
  description: "BFS OS 개인정보처리방침",
};

/**
 * 로그인 없이 읽을 수 있어야 한다(앱 심사 제출 시 요구되는 공개 URL).
 * 내용은 실제 코드·스키마에서 수집하는 항목만 적는다 — 쓰지 않는 항목을 적지 않는다.
 */
export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 pb-20 pt-[max(20px,env(safe-area-inset-top))]">
      <Link href="/landing" className="inline-flex w-fit" aria-label="BFS OS 소개">
        <Logo />
      </Link>

      <h1 className="mt-8 text-[26px] font-extrabold tracking-[-0.02em]">
        개인정보처리방침
      </h1>
      <p className="mt-1 text-[13px] text-sub">시행일 2026년 9월 30일</p>

      <div className="mt-7 space-y-6 text-[14px] leading-relaxed text-ink2">
        <section>
          <h2 className="mb-1.5 text-[15px] font-bold text-ink">1. 수집하는 항목</h2>
          <p className="mb-2">
            서비스 제공에 필요한 최소한의 정보만 수집합니다.
          </p>
          <ul className="space-y-1.5 pl-1">
            <li>
              <b className="text-ink">계정</b> — 이메일, 비밀번호(단방향 암호화 저장),
              이름, 연락처, 직함, 경력 연수, 전문 분야
            </li>
            <li>
              <b className="text-ink">소셜 로그인 이용 시</b> — 카카오 회원번호와 닉네임
              (이메일은 요청하지 않습니다)
            </li>
            <li>
              <b className="text-ink">운영 데이터</b> — 작업 제목·위치·상태·처리 이력,
              민원 제목과 입주사 표기(예: 302호 ○○테크)
            </li>
            <li>
              <b className="text-ink">결제(유료 전환 시)</b> — 주문번호, 결제 수단, 금액,
              영수증 주소. <b className="text-ink">카드번호는 저장하지 않으며</b> 결제사가
              직접 처리합니다.
            </li>
            <li>
              <b className="text-ink">자동 수집</b> — 접속 기록, 기기·브라우저 정보,
              서비스 이용 기록(화면 조회, 기능 사용). 이름·이메일·연락처는 통계 도구로
              전송하지 않습니다.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-1.5 text-[15px] font-bold text-ink">2. 이용 목적</h2>
          <p>
            회원 식별과 로그인 유지, 빌딩별 권한 관리, 작업 배정과 처리 기록 제공, 비밀번호
            재설정 등 고객 응대, 서비스 개선을 위한 이용 통계 분석, 유료 이용 시 결제와
            영수증 발급.
          </p>
        </section>

        <section>
          <h2 className="mb-1.5 text-[15px] font-bold text-ink">3. 보유 기간</h2>
          <p>
            회원 탈퇴 시 계정과 관련 데이터를 <b className="text-ink">지체 없이 파기</b>
            합니다. 관리소장이 탈퇴하면 해당 빌딩의 팀원 계정·작업·민원 기록이 함께
            삭제되므로, 탈퇴 전 안내 문구를 확인해 주세요. 다만 전자상거래법 등 법령이 보존을
            요구하는 결제·거래 기록은 정해진 기간 동안 분리 보관한 뒤 파기합니다.
          </p>
        </section>

        <section>
          <h2 className="mb-1.5 text-[15px] font-bold text-ink">4. 제3자 제공</h2>
          <p>
            회사는 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만 아래와 같이 서비스
            운영에 필요한 업무를 위탁하고 있으며, 일부 수탁사는 해외에 서버를 두고 있습니다.
          </p>
        </section>

        <section>
          <h2 className="mb-1.5 text-[15px] font-bold text-ink">
            5. 처리 위탁 및 국외 이전
          </h2>
          <div className="overflow-hidden rounded-2xl border border-line">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="bg-card text-left text-sub">
                  <th className="px-3 py-2 font-bold">수탁사</th>
                  <th className="px-3 py-2 font-bold">위탁 업무</th>
                  <th className="px-3 py-2 font-bold">보관 위치</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-line">
                  <td className="px-3 py-2">Vercel Inc.</td>
                  <td className="px-3 py-2">서비스 호스팅</td>
                  <td className="px-3 py-2">미국</td>
                </tr>
                <tr className="border-t border-line">
                  <td className="px-3 py-2">Neon Inc.</td>
                  <td className="px-3 py-2">데이터베이스 보관</td>
                  <td className="px-3 py-2">미국</td>
                </tr>
                <tr className="border-t border-line">
                  <td className="px-3 py-2">Resend Inc.</td>
                  <td className="px-3 py-2">비밀번호 재설정 메일 발송</td>
                  <td className="px-3 py-2">미국</td>
                </tr>
                <tr className="border-t border-line">
                  <td className="px-3 py-2">Google LLC</td>
                  <td className="px-3 py-2">이용 통계 분석</td>
                  <td className="px-3 py-2">미국</td>
                </tr>
                <tr className="border-t border-line">
                  <td className="px-3 py-2">카카오</td>
                  <td className="px-3 py-2">소셜 로그인 인증</td>
                  <td className="px-3 py-2">대한민국</td>
                </tr>
                <tr className="border-t border-line">
                  <td className="px-3 py-2">토스페이먼츠</td>
                  <td className="px-3 py-2">결제 처리(유료 전환 시)</td>
                  <td className="px-3 py-2">대한민국</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-[12.5px] text-sub">
            이전 항목은 각 업무 수행에 필요한 최소 정보이며, 이전 시기는 서비스 이용
            시점입니다. 수탁사는 위탁 업무 목적 외로 정보를 이용할 수 없습니다.
          </p>
        </section>

        <section>
          <h2 className="mb-1.5 text-[15px] font-bold text-ink">6. 이용자의 권리</h2>
          <p>
            언제든지 본인 정보를 열람·수정하거나 탈퇴할 수 있습니다. 앱에서{" "}
            <b className="text-ink">[전체] → 계정 관리</b>로 들어가면 프로필 수정, 비밀번호
            변경, 계정 탈퇴를 직접 하실 수 있습니다. 처리에 이의가 있으시면 아래 연락처로
            문의해 주세요.
          </p>
        </section>

        <section>
          <h2 className="mb-1.5 text-[15px] font-bold text-ink">7. 안전성 확보 조치</h2>
          <p>
            비밀번호는 복호화가 불가능한 방식으로 암호화해 저장하고, 모든 통신은 HTTPS로
            암호화합니다. 데이터 접근 권한은 담당자 최소 인원으로 제한하며, 로그인 세션은
            서명된 토큰으로 검증합니다.
          </p>
        </section>

        <section>
          <h2 className="mb-1.5 text-[15px] font-bold text-ink">
            8. 개인정보 보호책임자
          </h2>
          <p>
            최려원 · rockid8choie@gmail.com
            <br />
            개인정보 침해에 대한 상담이 필요하시면 개인정보침해신고센터(privacy.kisa.or.kr,
            국번 없이 118)에 문의하실 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="mb-1.5 text-[15px] font-bold text-ink">9. 변경 고지</h2>
          <p>
            방침이 변경되면 시행일 7일 전에 앱 내 공지로 알려드립니다.
          </p>
        </section>
      </div>

      <div className="mt-10 border-t border-line pt-5 text-[12px] leading-relaxed text-sub">
        닌자보스걸 · 대표 최려원 · 사업자등록번호 730-29-01800
        <br />
        문의 rockid8choie@gmail.com
      </div>

      <div className="mt-6 flex gap-4 text-[13px] font-semibold text-sub">
        <Link href="/terms" className="text-ink2">
          이용약관
        </Link>
        <Link href="/landing">서비스 소개</Link>
      </div>
    </div>
  );
}
