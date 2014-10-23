#!/usr/bin/python

from __future__ import print_function
import optparse
import os
import sys
import glob
import ninja_syntax

def replace_ext(filename, ext):
    return os.path.splitext(filename)[0] + ext

if __name__ == '__main__':
    parser = optparse.OptionParser()
    parser.add_option("--disable-emscripten", action="store_false", dest="build_emscripten", default=True)
    parser.add_option("--with-emcc", dest="emcc", default="emcc")
    parser.add_option("--with-em++", dest="emcxx", default="em++")
    parser.add_option("--disable-pnacl", action="store_false", dest="build_pnacl", default=True)
    parser.add_option("--with-protoc", dest="protoc", default="protoc")
    parser.add_option("--with-nacl-sdk", dest="nacl_sdk", default=os.getenv("NACL_SDK_ROOT"))
    options, _ = parser.parse_args()

    root_dir = os.path.dirname(os.path.abspath(__file__))

    proto_dir = os.path.join(root_dir, "protobuf")
    pnacl_build_dir = os.path.join(root_dir, "build", "pnacl")
    emscripten_build_dir = os.path.join(root_dir, "build", "emscripten")
    c_source_dir = os.path.join(root_dir, "lib", "c")

    with open('build.ninja', 'w') as buildfile:
        ninja = ninja_syntax.Writer(buildfile)

        # Variables
        ninja.variable('source_dir', c_source_dir)
        ninja.variable('nacl_sdk_dir', os.path.join(options.nacl_sdk))
        if sys.platform == 'win32':
            ninja.variable('pnacl_toolchain_dir', '$nacl_sdk_dir/toolchain/win_pnacl')
            ninja.variable('pnacl_cc', '$pnacl_toolchain_dir/bin/pnacl-clang.bat')
            ninja.variable('pnacl_cxx', '$pnacl_toolchain_dir/bin/pnacl-clang++.bat')
            ninja.variable('pnacl_finalize', '$pnacl_toolchain_dir/bin/pnacl-finalize.bat')
        elif sys.platform == 'linux2':
            ninja.variable('pnacl_toolchain_dir', '$nacl_sdk_dir/toolchain/linux_pnacl')
            ninja.variable('pnacl_cc', '$pnacl_toolchain_dir/bin/pnacl-clang')
            ninja.variable('pnacl_cxx', '$pnacl_toolchain_dir/bin/pnacl-clang++')
            ninja.variable('pnacl_finalize', '$pnacl_toolchain_dir/bin/pnacl-finalize')
        elif sys.platform == 'darwin':
            ninja.variable('pnacl_toolchain_dir', '$nacl_sdk_dir/toolchain/mac_pnacl')
            ninja.variable('pnacl_cc', '$pnacl_toolchain_dir/bin/pnacl-clang')
            ninja.variable('pnacl_cxx', '$pnacl_toolchain_dir/bin/pnacl-clang++')
            ninja.variable('pnacl_finalize', '$pnacl_toolchain_dir/bin/pnacl-finalize')
        else:
            print("Unsupported platform: " + sys.platform, file=sys.stderr)
            exit(1)
        ninja.variable('emcc', options.emcc)
        ninja.variable('emcxx', options.emcxx)
        ninja.variable('protoc', options.protoc)

        # Rules
        ninja.rule('COMPILE_PNACL_C', '$pnacl_cc -o $out -c $in -MMD -MF $out.d $optflags $cflags',
            deps='gcc', depfile='$out.d',
            description='CC[PNaCl] $in')
        ninja.rule('COMPILE_PNACL_CXX', '$pnacl_cxx -o $out -c $in -MMD -MF $out.d $optflags $cxxflags',
            deps='gcc', depfile='$out.d',
            description='CXX[PNaCl] $in')
        ninja.rule('LINK_PNACL_C', '$pnacl_cc -o $out $in $ldflags',
            description='CCLD[PNaCl] $out')
        ninja.rule('LINK_PNACL_CXX', '$pnacl_cxx -o $out $in $ldflags',
            description='CXXLD[PNaCl] $out')
        ninja.rule('FINALIZE_PNACL', '$pnacl_finalize -o $out $in',
            description='FINALIZE[PNaCl] $out')
        ninja.rule('COMPILE_EMSCRIPTEN_C', '$emcc -o $out -c $in -MMD -MF $out.d $optflags $cflags',
            deps='gcc', depfile='$out.d',
            description='CC[EM] $in')
        ninja.rule('LINK_EMSCRIPTEN_C', '$emcc -o $out $in $ldflags $jsflags',
            description='CCLD[EM] $out')
        ninja.rule('PROTOC_CXX', '$protoc --proto_path=$indir --cpp_out=$outdir $in',
            description='PROTOC[CXX] $in')

        # Build targets
        proto_sources = ["Requests.proto", "Responses.proto"]
        pnacl_sources = ["common/Create.c", "common/DataType.c", "common/IdMap.c", "common/NDArray.c", "common/Arith.c", "nacl/Entry.c", "nacl/Strings.c", "nacl/Dispatch.cc", "nacl/Requests.pb.cc", "nacl/Responses.pb.cc"]
        emscripten_sources = ["common/Create.c", "common/DataType.c", "common/IdMap.c", "common/NDArray.c"]

        for proto_source in proto_sources:
            ninja.build(
                [
                    os.path.join(c_source_dir, "nacl", replace_ext(proto_source, ".pb.cc")),
                    os.path.join(c_source_dir, "nacl", replace_ext(proto_source, ".pb.h"))
                ],
                "PROTOC_CXX",
                os.path.join(proto_dir, proto_source),
                variables={
                    'indir': proto_dir, 'outdir': os.path.join(c_source_dir, "nacl")
                })

        # Compile PNaCl C/C++ sources
        if options.build_pnacl:
            for source in pnacl_sources:
                if os.path.splitext(source)[1] == ".c":
                    ninja.build(os.path.join(pnacl_build_dir, replace_ext(source, ".bc")),
                        'COMPILE_PNACL_C',
                        os.path.join(c_source_dir, source),
                        variables={'optflags': '-O3',
                            'cflags': '-I$nacl_sdk_dir/include -I$source_dir -pthread -g -std=gnu99 -Wno-long-long -Wall -Werror -Wno-unused-variable -Wno-error=unused-function'})
                else:
                    ninja.build(os.path.join(pnacl_build_dir, replace_ext(source, ".bc")),
                        'COMPILE_PNACL_CXX',
                        os.path.join(c_source_dir, source),
                        variables={'optflags': '-O3',
                            'cxxflags': '-I$nacl_sdk_dir/include -I$source_dir -pthread -g -std=gnu++11 -fno-exceptions -Wno-long-long -Wall -Werror -Wno-unused-variable -Wno-error=unused-function'})

        # Compile Emscripten C sources
        if options.build_emscripten:
            for source in emscripten_sources:
                ninja.build(os.path.join(emscripten_build_dir, replace_ext(source, ".bc")),
                    'COMPILE_EMSCRIPTEN_C',
                    os.path.join(c_source_dir, source),
                    variables={'optflags': '-O3',
                        'cflags': '-I$source_dir -g -std=gnu99 -Wno-long-long -Wall -Werror -Wno-unused-variable -Wno-error=unused-function -Wno-warn-absolute-paths'})

        # Link and finalize PNaCl objects
        ninja.build(os.path.join(root_dir, 'furious.bc'), 'LINK_PNACL_CXX',
            [os.path.join(pnacl_build_dir, replace_ext(path, ".bc")) for path in pnacl_sources],
            variables={'ldflags': '-L$nacl_sdk_dir/lib/pnacl/Release -lppapi -lm -lprotobuf-lite'})
        ninja.build(os.path.join(root_dir, 'furious.pexe'), 'FINALIZE_PNACL', os.path.join(root_dir, 'furious.bc'))

        # Link Emscripten objects and generate JavaScript
        ninja.build(os.path.join(root_dir, 'furious.asm.js'), 'LINK_EMSCRIPTEN_C',
            [os.path.join(emscripten_build_dir, replace_ext(path, ".bc")) for path in emscripten_sources])
