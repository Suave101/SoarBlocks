#include <emscripten.h>
#include "sml_ClientKernel.h"
#include "sml_ClientAgent.h"

static sml::Kernel* pKernel = nullptr;
static sml::Agent* pAgent = nullptr;

extern "C" {
    EMSCRIPTEN_KEEPALIVE
    void init_soar() {
        pKernel = sml::Kernel::CreateKernelInCurrentThread();
        pAgent = pKernel->CreateAgent("soar-wasm-agent");
    }

    EMSCRIPTEN_KEEPALIVE
    void load_productions(const char* soar_code) {
        if (pAgent) pAgent->ExecuteCommandLine(soar_code);
    }

    EMSCRIPTEN_KEEPALIVE
    const char* step_decision() {
        if (!pAgent) return "";
        pAgent->RunSelf(1, sml::sml_DECIDE);
        return pAgent->ExecuteCommandLine("print --depth 2 <s>"); 
    }
}