import Link from "next/link";
import type { Metadata } from "next";
import Logo from "@/components/Logo";

export const metadata: Metadata = {
  title: "이용약관 — BFS OS",
  description: "BFS OS 서비스 이용약관",
};

/** 로그인 없이 읽을 수 있어야 한다(가입 전 고지·앱 심사 확인 경로). */
export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 pb-20 pt-[max(20px,env(safe-area-inset-top))]">
      <Link href="/landing" className="inline-flex w-fit" aria-label="BFS OS 소개">
        <Logo />
      </Link>

      <h1 className="mt-8 text-[26px] font-extrabold tracking-[-0.02em]">이용약관</h1>
      <p className="mt-1 text-[13px] text-sub">시행일 2026년 9월 30일</p>

      <div className="mt-7 space-y-6 text-[14px] leading-relaxed text-ink2">
        <section>
          <h2 className="mb-1.5 text-[15px] font-bold text-ink">1. 서비스</h2>
          <p>
            BFS OS(이하 &ldquo;서비스&rdquo;)는 빌딩 시설 운영을 돕는 소프트웨어입니다.
            민원·작업을 접수하면 유형이 자동 분류되고 담당자 배정과 처리 기록이 서버에
            남습니다. 서비스는 기록과 전달을 돕는 도구이며, 실제 시설의 점검·수리
            행위를 대행하지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="mb-1.5 text-[15px] font-bold text-ink">2. 계정</h2>
          <p>
            관리소장이 가입하면 빌딩이 함께 만들어지며, 소장은 같은 빌딩의 시설팀 계정을
            발급할 수 있습니다. 계정은 실제 담당자 본인이 사용해야 하고, 비밀번호는 타인과
            공유하지 않아야 합니다. 계정 정보 관리 소홀로 생긴 문제에 대해 회사는 책임을
            지지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="mb-1.5 text-[15px] font-bold text-ink">3. 이용료</h2>
          <p>
            현재 서비스는 <b className="text-ink">전부 무료</b>로 제공됩니다. 유료 요금제를
            시작할 경우 최소 30일 전에 앱과 이메일로 미리 알려드리며, 그때까지 쌓인 데이터와
            이력은 그대로 유지됩니다. 사전 고지 없이 무료 이용 중인 기능을 유료로 전환하지
            않습니다.
          </p>
        </section>

        <section>
          <h2 className="mb-1.5 text-[15px] font-bold text-ink">4. 데이터의 귀속</h2>
          <p>
            고객이 입력한 운영 데이터(작업지시, 민원 기록, 담당자 배정 이력 등)는 해당
            빌딩 고객의 것입니다. 회사는 서비스 제공과 장애 대응에 필요한 범위에서만
            데이터를 처리하며, 고객 동의 없이 제3자에게 제공하거나 광고 목적으로 이용하지
            않습니다. 탈퇴 시 처리 방식은 개인정보처리방침을 따릅니다.
          </p>
        </section>

        <section>
          <h2 className="mb-1.5 text-[15px] font-bold text-ink">5. 금지 행위</h2>
          <p>
            타인의 계정 도용, 허위 정보 입력, 서비스의 정상 운영을 방해하는 행위(비정상적인
            대량 요청, 역설계, 무단 수집 등), 법령이나 공공질서에 반하는 목적의 이용은
            제한됩니다. 위반이 확인되면 이용을 정지할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="mb-1.5 text-[15px] font-bold text-ink">6. 책임의 한계</h2>
          <p>
            서비스는 시설 운영 업무를 기록·전달하는 도구입니다. 법정점검 의무 이행, 시설의
            안전 관리, 실제 보수 결과에 대한 책임은 해당 빌딩의 관리 주체에게 있습니다.
            회사는 천재지변, 통신 장애 등 통제할 수 없는 사유로 인한 서비스 중단에 대해
            책임을 지지 않으며, 그 외의 경우 관련 법령이 정한 범위에서 책임을 집니다.
          </p>
        </section>

        <section>
          <h2 className="mb-1.5 text-[15px] font-bold text-ink">7. 서비스의 변경·중단</h2>
          <p>
            회사는 서비스의 내용을 개선하거나 변경할 수 있습니다. 서비스를 종료하는 경우
            최소 30일 전에 공지하고, 고객이 데이터를 내려받을 수 있는 방법을 함께
            안내합니다.
          </p>
        </section>

        <section>
          <h2 className="mb-1.5 text-[15px] font-bold text-ink">8. 약관의 변경</h2>
          <p>
            약관이 바뀌면 시행일 7일 전(고객에게 불리한 변경은 30일 전)에 앱 내 공지로
            알려드립니다. 변경된 약관에 동의하지 않으시면 언제든 탈퇴하실 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="mb-1.5 text-[15px] font-bold text-ink">9. 문의</h2>
          <p>rockid8choie@gmail.com</p>
        </section>
      </div>

      <div className="mt-10 border-t border-line pt-5 text-[12px] leading-relaxed text-sub">
        닌자보스걸 · 대표 최려원 · 사업자등록번호 730-29-01800
        <br />
        문의 rockid8choie@gmail.com
      </div>

      <div className="mt-6 flex gap-4 text-[13px] font-semibold text-sub">
        <Link href="/privacy" className="text-ink2">
          개인정보처리방침
        </Link>
        <Link href="/landing">서비스 소개</Link>
      </div>
    </div>
  );
}
