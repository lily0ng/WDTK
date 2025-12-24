import zxcvbn from 'zxcvbn'

export async function toolPassword({ params }) {
  const password = String(params?.password ?? '')
  const result = zxcvbn(password)
  return {
    ok: true,
    score: result.score,
    guesses: result.guesses,
    crackTimes: result.crack_times_display,
    feedback: result.feedback
  }
}
