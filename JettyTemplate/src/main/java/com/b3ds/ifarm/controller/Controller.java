package com.b3ds.ifarm.controller;

import javax.servlet.http.HttpServletRequest;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@org.springframework.stereotype.Controller
public class Controller {
	
	private final Logger logger = LogManager.getLogger(Controller.class);
	
	
	@RequestMapping("/")
	public String index(HttpServletRequest req)
	{
		return "redirect:index.html";
	}

	@RequestMapping("/something")
	public String some(HttpServletRequest req)
	{
		logger.debug("#############################################################################");
		return "indexes";
	}

	@RequestMapping("/llp")
	public String somes(HttpServletRequest req)
	{
		logger.debug("#############################################################################");
		return "llp";
	}
	
}
