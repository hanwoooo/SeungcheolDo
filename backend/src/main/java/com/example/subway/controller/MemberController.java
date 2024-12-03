package com.example.subway.controller;

import com.example.subway.dto.LoginDto;
import com.example.subway.dto.ProfileDto;
import com.example.subway.dto.SignUpDto;
import com.example.subway.entity.MemberEntity;
import com.example.subway.service.MemberService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class MemberController {

    private final MemberService memberService;

    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    // 회원가입
    @PostMapping("/members/signup")
    public ResponseEntity<String> signUp(@RequestBody SignUpDto signUpDto) {
        boolean isRegistered = memberService.signUp(signUpDto);
        if (isRegistered) {
            return ResponseEntity.ok("Signup successful");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Signup failed"); // 400
        }
    }

    // 로그인
    @PostMapping("/members/login")
    public ResponseEntity<String> login(HttpServletRequest request, @RequestBody LoginDto loginDto) {
        boolean isLogin = memberService.login(loginDto);

        if (isLogin) {
            // 세션 생성
            HttpSession session = request.getSession();
            session.setAttribute("memberEmail", loginDto.getMemberEmail());
            return ResponseEntity.ok("Login successful");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login failed");
        }
    }

    // 회원 정보
    @GetMapping("/members/profile")
    public ResponseEntity<ProfileDto> getProfile(HttpServletRequest request) {
        HttpSession session = request.getSession(false); // 세션이 없으면 null을 반환
        String memberEmail = (String) session.getAttribute("memberEmail");
        MemberEntity member = memberService.findByMemberEmail(memberEmail);
        ProfileDto profileDto = ProfileDto.toProfileDto(member);
        return ResponseEntity.ok(profileDto);
    }

    // 로그아웃
    @GetMapping("/members/logout")
    public ResponseEntity<String> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false); // 기존 세션이 있을 때만 가져옴
        session.invalidate(); // 세션 무효화, 세션에 저장된 모든 데이터 삭제

        return ResponseEntity.ok("Logout successful");
    }
}