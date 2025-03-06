import { describe, expect, it } from "@jest/globals";
import { parseExtra as parse, pos } from '../utils';
import { formatBytes, getArtworkCallLabel, getArtworkCompletions, getAudioCompletions, getImageCompletions, getImageMarkdownString, getProgramArtworks, getShaderCompletions, getVideoCompletions, isSupportedAudio, isSupportedImage, isSupportedShader, refreshArtworkLabels, scanArtworkLabels } from "../../src/utils/media";
import * as path from "path";
import constants from "../../src/constants";
import { getProgramErrors } from "../../src/utils/diagnostics";

jest.replaceProperty(constants, "FE_LAYOUTS_PATH", "tests");

let getConfigValueFunc = (...any) => {};
jest.mock('../../src/utils/config.ts', () => ({
    ...jest.requireActual('../../src/utils/config.ts'),
    getConfigValue: (...any) => getConfigValueFunc(...any),
}));

beforeEach(() => {
    getConfigValueFunc = () => false;
});

describe("Media", () => {

    it("addMediaCalls, image missing", () => {
        getConfigValueFunc = (v) => {
            switch (v) {
                case constants.SHOW_MISSING_ENABLED: return true;
                case constants.ATTRACT_MODE_PATH: return "mock/path";
            }
        }
        const program = parse(`fe.add_image("missing.png")`);
        expect(getProgramErrors(program).length).toEqual(1);
    });

    it("addMediaCalls, shader missing", () => {
        getConfigValueFunc = (v) => {
            switch (v) {
                case constants.SHOW_MISSING_ENABLED: return true;
                case constants.ATTRACT_MODE_PATH: return "mock/path";
            }
        }
        const program = parse(`fe.add_shader(null, "missing.png", "missing.png")`);
        expect(getProgramErrors(program).length).toEqual(2);
    });

    it("getProgramArtworks, invalid", () => {
        const program = parse("");
        expect(getProgramArtworks(program)).toEqual([]);
    });

    it("getProgramArtworks", () => {
        const program = parse(`fe.add_artwork("snap");`);
        expect(getProgramArtworks(program)).toHaveLength(1);
    });

    it("getArtworkCallLabel, undefined", () => {
        expect(getArtworkCallLabel([])).toBeUndefined();
    });

    it("isSupportedImage", () => {
        expect(isSupportedImage("img.PNG")).toBe(true);
        expect(isSupportedImage("img.png")).toBe(true);
        expect(isSupportedImage("img.jpg")).toBe(true);
        expect(isSupportedImage("img.jpeg")).toBe(true);
        expect(isSupportedImage("img.gif")).toBe(true);
        expect(isSupportedImage("img.bmp")).toBe(true);
        expect(isSupportedImage("img.tga")).toBe(true);

        expect(isSupportedImage("img.target")).toBe(false);
        expect(isSupportedImage(".png-png")).toBe(false);
    });

    it("isSupportedAudio", () => {
        expect(isSupportedAudio("snd.wav")).toBe(true);
        expect(isSupportedAudio("snd.mp3")).toBe(true);
        expect(isSupportedAudio("snd.aac")).toBe(true);

        expect(isSupportedAudio("snd.target")).toBe(false);
        expect(isSupportedAudio(".wav-wav")).toBe(false);
    });

    it("isSupportedShader", () => {
        expect(isSupportedShader("shader.frag")).toBe(true);
        expect(isSupportedShader("shader.vert")).toBe(true);

        expect(isSupportedAudio("shader.bad")).toBe(false);
    });

    it("getImageMarkdownString, invalid", () => {
        const corruptPath = path.join(__dirname, '../samples/layout/simple_bad.png');
        expect(getImageMarkdownString(corruptPath, __filename, 100)).toBeUndefined();
        expect(getImageMarkdownString("missing.bad", __filename, 100)).toBeUndefined();
        expect(getImageMarkdownString("missing.png", __filename, 100)).toBeUndefined();
        expect(getImageMarkdownString(__filename, __filename, 100)).toBeUndefined();
    });

    it("getImageMarkdownString, image", () => {
        const imagePath = path.join(__dirname, '../samples/layout/simple_nut.png');
        const md = getImageMarkdownString(imagePath, imagePath, 100);
        expect(md.supportHtml).toBe(true);
        expect(md.value).toContain("<img");
        expect(md.value).toContain(`width="110"`);
        expect(md.value).toContain(`height="110"`);
        expect(md.value).toContain('simple_nut.png');
    });

    it("getImageMarkdownString, image wide", () => {
        const imagePath = path.join(__dirname, '../samples/layout/simple_wide.png');
        const md = getImageMarkdownString(imagePath, imagePath, 100);
        expect(md.supportHtml).toBe(true);
        expect(md.value).toContain("<img");
        expect(md.value).toContain(`width="110"`);
        expect(md.value).toContain(`height="110"`);
        expect(md.value).toContain('simple_wide.png');
    });

    it("getImageMarkdownString, video", () => {
        const imagePath = path.join(__dirname, '../samples/layout/simple_nut.mp4');
        const md = getImageMarkdownString(imagePath, imagePath, 100);
        expect(md.supportHtml).toBe(true);
        expect(md.value).toContain("<video");
        expect(md.value).toContain('simple_nut.mp4');
    });

    it("getImageMarkdownString, video autoplay", () => {
        const imagePath = path.join(__dirname, '../samples/layout/simple_nut.mp4');
        getConfigValueFunc = (v) => {
            switch (v) {
                case constants.HOVER_VIDEO_AUTOPLAY:
                    return true;
            }
        }
        const md = getImageMarkdownString(imagePath, imagePath, 100);
        expect(md.supportHtml).toBe(true);
        expect(md.value).toContain("<video");
        expect(md.value).toContain("autoplay");
        expect(md.value).toContain('simple_nut.mp4');
    });

    // -------------------------------------------------------------------------

    it("formatBytes", () => {
        expect(formatBytes(1)).toBe("1B");
        expect(formatBytes(1023)).toBe("1023B");
        expect(formatBytes(1024)).toBe("1.00KB");
        expect(formatBytes(1896)).toBe("1.85KB");
        expect(formatBytes(1024*1024)).toBe("1.00MB");
        expect(formatBytes(1024*1024*1.5)).toBe("1.50MB");
    });

    // -------------------------------------------------------------------------

    it("getImageCompletions", () => {
        // NOTE: layout path has been mocked here
        const filename = path.join(__dirname, "../samples/layout/layout.nut");
        const completions = getImageCompletions(filename);
        expect(completions.length).toBeGreaterThan(0);
        expect(getImageCompletions(undefined)).toHaveLength(0);
    });

    it("getVideoCompletions", () => {
        // NOTE: layout path has been mocked here
        const filename = path.join(__dirname, "../samples/layout/layout.nut");
        const completions = getVideoCompletions(filename);
        expect(completions.length).toBeGreaterThan(0);
        expect(getVideoCompletions(undefined)).toHaveLength(0);
    });

    it("getAudioCompletions", () => {
        // NOTE: layout path has been mocked here
        const filename = path.join(__dirname, "../samples/layout/layout.nut");
        const completions = getAudioCompletions(filename);
        expect(completions.length).toBeGreaterThan(0);
        expect(getAudioCompletions(undefined)).toHaveLength(0);
    });

    it("getShaderCompletions", () => {
        // NOTE: layout path has been mocked here
        const filename = path.join(__dirname, "../samples/layout/layout.nut");
        const completions = getShaderCompletions(filename);
        expect(completions.length).toBeGreaterThan(0);
        expect(getShaderCompletions(undefined)).toHaveLength(0);
    });

    it("getArtworkCompletions", () => {
        getConfigValueFunc = (v) => {
            switch (v) {
                case constants.SCAN_ARTWORK_ENABLED:
                    return false;
                case constants.ATTRACT_MODE_ARTWORK:
                    return "one,two";
            }
        };

        expect(getArtworkCompletions()).toEqual([]);
        refreshArtworkLabels();
        expect(getArtworkCompletions().length).toEqual(2);
    });

    it("scanArtworkLabels", () => {
        getConfigValueFunc = (v) => {
            switch (v) {
                case constants.SCAN_ARTWORK_ENABLED:
                    return true;
                case constants.ATTRACT_MODE_PATH:
                    return path.join(__dirname, "../samples");
            }
        };

        const labels = scanArtworkLabels();
        expect(labels.length).toEqual(2);
        expect(labels[0]).toEqual("one");
        expect(labels[1]).toEqual("two");

        // again to use cached
        expect(scanArtworkLabels().length).toEqual(2);

    });


});
